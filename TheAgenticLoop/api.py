import asyncio
import json
import uuid
from typing import Optional, Dict, Any, AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, BackgroundTasks, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
import redis.asyncio as redis

# ==========================================
# CONFIGURATION & CONSTANTS
# ==========================================
REDIS_URL = "redis://localhost:6379"
QUEUE_PREFIX = "queue"
LOG_CHANNEL_PREFIX = "logs"
BUFFER_SIZE = 3  # Target number of questions to keep in queue

# ==========================================
# APP SETUP & LIFESPAN
# ==========================================

# Global Redis Client
redis_client: Optional[redis.Redis] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the application lifecycle.
    Replaces deprecated @app.on_event("startup") and ("shutdown").
    """
    global redis_client
    
    # --- STARTUP LOGIC ---
    try:
        redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        # Fast ping to ensure connection
        await redis_client.ping()
        print(f"✅ Connected to Redis at {REDIS_URL}")
    except Exception as e:
        print(f"❌ Failed to connect to Redis: {e}")
        # In production, we would crash the pod here.
    
    yield  # Application runs here
    
    # --- SHUTDOWN LOGIC ---
    if redis_client:
        await redis_client.close()
        print("🛑 Redis connection closed")

app = FastAPI(title="Phase 2: Prefetching Agent Architecture", lifespan=lifespan)

# CORS is non-negotiable for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# MOCK AGENT & BACKGROUND WORKERS
# ==========================================

async def mock_agent_generation(session_id: str, topic: str = "Geography") -> Dict[str, Any]:
    """
    Simulates a heavy LangGraph agent.
    1. Publishes thought logs to Redis Pub/Sub.
    2. Returns the final JSON payload with location data.
    """
    channel = f"{LOG_CHANNEL_PREFIX}:{session_id}"
    
    # Target locations for riddles
    LOCATIONS = [
        {"name": "Paris", "lat": 48.8566, "lng": 2.3522, 
         "riddle": "City of lights where iron lady stands tall, romance and art enchant one and all."},
        {"name": "Tokyo", "lat": 35.6762, "lng": 139.6503,
         "riddle": "Neon-lit streets where tradition meets tech, cherry blossoms bloom and anime's the beck."},
        {"name": "New York", "lat": 40.7128, "lng": -74.0060,
         "riddle": "Concrete jungle where dreams are made, the big apple's skyline never will fade."},
        {"name": "London", "lat": 51.5074, "lng": -0.1278,
         "riddle": "Where Big Ben chimes and double-deckers roam, the Thames flows through this ancient home."},
        {"name": "Sydney", "lat": -33.8688, "lng": 151.2093,
         "riddle": "Opera house shells by the harbor blue, kangaroos hop in the outback too."},
        {"name": "Cairo", "lat": 30.0444, "lng": 31.2357,
         "riddle": "Ancient pyramids stand in desert sand, the Nile flows through this timeless land."},
        {"name": "Rio de Janeiro", "lat": -22.9068, "lng": -43.1729,
         "riddle": "Christ the Redeemer watches the bay, samba rhythms night and day."},
        {"name": "Moscow", "lat": 55.7558, "lng": 37.6173,
         "riddle": "Red Square's domes in winter's grasp, the Kremlin holds history's clasp."},
        {"name": "Dubai", "lat": 25.2048, "lng": 55.2708,
         "riddle": "Tallest tower in desert's heart, luxury shopping in every mart."},
        {"name": "Mumbai", "lat": 19.0760, "lng": 72.8777,
         "riddle": "Bollywood dreams and Gateway grand, monsoon rains kiss this vibrant land."},
    ]
    
    # 1. Simulation: Initial Analysis
    if redis_client:
        await redis_client.publish(channel, f"Analyzing request for topic: {topic}...")
    await asyncio.sleep(1.0) # Simulate LLM latency
    
    # 2. Simulation: Tool Usage
    if redis_client:
        await redis_client.publish(channel, "Searching global locations database...")
    await asyncio.sleep(1.0) 
    
    # 3. Simulation: Riddle Generation
    if redis_client:
        await redis_client.publish(channel, "Generating cryptic location riddle...")
    await asyncio.sleep(1.0)
    
    # 4. Final Result
    if redis_client:
        await redis_client.publish(channel, "Generation complete.")
    
    # Select random location
    import random
    location = random.choice(LOCATIONS)
    
    return {
        "riddle": location["riddle"],
        "answer": location["name"],
        "difficulty": "Medium",
        "topic": topic,
        "location": {
            "name": location["name"],
            "lat": location["lat"],
            "lng": location["lng"]
        }
    }

async def buffer_worker(session_id: str, count: int = 1):
    """
    Background Task:
    Generates 'count' questions and pushes them to the Redis List (Queue).
    """
    if not redis_client:
        print("❌ Worker failed: No Redis connection")
        return

    print(f"⚙️ Background Task: Generating {count} questions for {session_id}")
    
    for _ in range(count):
        # Generate the content (Slow operation)
        riddle_data = await mock_agent_generation(session_id)
        
        # Serialize and Push to Redis List (Right Push)
        queue_key = f"{QUEUE_PREFIX}:{session_id}"
        await redis_client.rpush(queue_key, json.dumps(riddle_data))
        
        print(f"✅ Buffered question for {session_id}")

# ==========================================
# ENDPOINTS
# ==========================================

@app.post("/start_session")
async def start_session(background_tasks: BackgroundTasks):
    """
    Initializes a user session and triggers the 'Cold Start' fill.
    We immediately start generating BUFFER_SIZE (3) questions.
    """
    session_id = str(uuid.uuid4())
    
    # Fire and forget: Fill the buffer immediately
    background_tasks.add_task(buffer_worker, session_id, BUFFER_SIZE)
    
    return {
        "session_id": session_id,
        "status": "initializing",
        "message": "Session started. Agents are pre-fetching content."
    }

@app.get("/get_question/{session_id}")
async def get_question(session_id: str, background_tasks: BackgroundTasks):
    """
    Prefetching Pattern Implementation:
    1. Try to pop from Redis Queue.
    2. If HIT: Return data + Trigger 1 background generation (maintain buffer).
    3. If MISS: Return 202 (Processing) + Trigger generation.
    """
    if not redis_client:
        raise HTTPException(status_code=503, detail="Redis unavailable")

    queue_key = f"{QUEUE_PREFIX}:{session_id}"
    
    # LPOP: Non-blocking pop from the left of the list
    raw_data = await redis_client.lpop(queue_key)
    
    if raw_data:
        # === CACHE HIT ===
        # We have data. Return it instantly.
        data = json.loads(raw_data)
        
        # Store answer in Redis for verification
        answer_key = f"answer:{session_id}"
        answer_data = {
            "answer": data.get("answer"),
            "location": data.get("location")
        }
        await redis_client.setex(answer_key, 3600, json.dumps(answer_data))  # Expire after 1 hour
        
        # Reset attempts counter
        attempts_key = f"attempts:{session_id}"
        await redis_client.delete(attempts_key)
        
        # CRITICAL: Trigger a background refill to ensure the user 
        # doesn't wait for the NEXT question.
        background_tasks.add_task(buffer_worker, session_id, 1)
        
        return {
            "status": "ready",
            "data": data,
            "queue_status": "refilling"
        }
    
    else:
        # === CACHE MISS ===
        # The user consumed content faster than we generated, or this is a cold start.
        background_tasks.add_task(buffer_worker, session_id, 1)
        
        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={
                "status": "processing",
                "message": "The agent is thinking. Please poll again shortly.",
                "retry_after": 2
            }
        )

@app.post("/verify_answer")
async def verify_answer(request: Request):
    """
    Verify if the user's answer is correct.
    Expects JSON body: {"session_id": str, "user_answer": str, "riddle_id": str}
    Returns: {"correct": bool, "location": dict (if correct), "attempts_remaining": int}
    """
    if not redis_client:
        raise HTTPException(status_code=503, detail="Redis unavailable")
    
    data = await request.json()
    session_id = data.get("session_id")
    user_answer = data.get("user_answer", "").strip().lower()
    
    if not session_id or not user_answer:
        raise HTTPException(status_code=400, detail="Missing session_id or user_answer")
    
    # Get the current riddle answer from Redis
    answer_key = f"answer:{session_id}"
    stored_answer = await redis_client.get(answer_key)
    
    if not stored_answer:
        raise HTTPException(status_code=404, detail="No active riddle found for this session")
    
    # Parse stored answer data
    answer_data = json.loads(stored_answer)
    correct_answer = answer_data.get("answer", "").strip().lower()
    location = answer_data.get("location")
    
    # Track attempts
    attempts_key = f"attempts:{session_id}"
    attempts = await redis_client.incr(attempts_key)
    await redis_client.expire(attempts_key, 3600)  # Expire after 1 hour
    
    # Verify answer (case-insensitive)
    is_correct = user_answer == correct_answer
    
    if is_correct:
        return {
            "correct": True,
            "location": location,
            "attempts": attempts,
            "message": f"Correct! It's {answer_data.get('answer')}!"
        }
    else:
        return {
            "correct": False,
            "attempts": attempts,
            "message": "Incorrect answer. Try again!"
        }

@app.get("/stream_logs/{session_id}")
async def stream_logs(session_id: str, request: Request):
    """
    SSE Endpoint.
    Subscribes to the specific Redis Channel for this session
    and yields logs in real-time to the client.
    """
    if not redis_client:
        raise HTTPException(status_code=503, detail="Redis unavailable")

    async def event_generator() -> AsyncGenerator[str, None]:
        # Create a dedicated PubSub connection for this request
        pubsub = redis_client.pubsub()
        channel = f"{LOG_CHANNEL_PREFIX}:{session_id}"
        await pubsub.subscribe(channel)
        
        try:
            # Check for client disconnect
            while True:
                if await request.is_disconnected():
                    break
                
                # Get message from channel with a short timeout to allow loop check
                message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                
                if message and message["type"] == "message":
                    # SSE format: "data: <payload>\n\n"
                    payload = message["data"]
                    yield f"{payload}"
                    
                    # If generation is complete, we might want to signal frontend?
                    # For now, we just keep stream open for the next question's logs.
                
                # Small yield to prevent CPU hogging
                await asyncio.sleep(0.1)
                
        except asyncio.CancelledError:
            print(f"Client disconnected from stream: {session_id}")
        finally:
            await pubsub.unsubscribe(channel)
            await pubsub.close()

    return EventSourceResponse(event_generator())