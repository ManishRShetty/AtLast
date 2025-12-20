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

# Import Polyglot AI riddle generator (multi-provider: Groq, Cohere, Gemini)
from polyglot_ai import generate_riddle

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
    AI-powered LangGraph agent.
    1. Publishes thought logs to Redis Pub/Sub.
    2. Generates riddle using AI.
    3. Returns the final JSON payload with location data.
    """
    channel = f"{LOG_CHANNEL_PREFIX}:{session_id}"
    
    # Expanded target locations - 32 diverse global cities
    LOCATIONS = [
        # Asia
        {"name": "Tokyo", "lat": 35.6762, "lng": 139.6503},
        {"name": "Kyoto", "lat": 35.0116, "lng": 135.7681},
        {"name": "Mumbai", "lat": 19.0760, "lng": 72.8777},
        {"name": "Bangkok", "lat": 13.7563, "lng": 100.5018},
        {"name": "Singapore", "lat": 1.3521, "lng": 103.8198},
        {"name": "Seoul", "lat": 37.5665, "lng": 126.9780},
        {"name": "Beijing", "lat": 39.9042, "lng": 116.4074},
        {"name": "Shanghai", "lat": 31.2304, "lng": 121.4737},
        {"name": "Hong Kong", "lat": 22.3193, "lng": 114.1694},
        {"name": "Bali", "lat": -8.3405, "lng": 115.0920},
        
        # Europe
        {"name": "Paris", "lat": 48.8566, "lng": 2.3522},
        {"name": "London", "lat": 51.5074, "lng": -0.1278},
        {"name": "Moscow", "lat": 55.7558, "lng": 37.6173},
        {"name": "Rome", "lat": 41.9028, "lng": 12.4964},
        {"name": "Barcelona", "lat": 41.3851, "lng": 2.1734},
        {"name": "Amsterdam", "lat": 52.3676, "lng": 4.9041},
        {"name": "Prague", "lat": 50.0755, "lng": 14.4378},
        {"name": "Vienna", "lat": 48.2082, "lng": 16.3738},
        {"name": "Athens", "lat": 37.9838, "lng": 23.7275},
        {"name": "Istanbul", "lat": 41.0082, "lng": 28.9784},
        
        # Americas
        {"name": "New York", "lat": 40.7128, "lng": -74.0060},
        {"name": "Rio de Janeiro", "lat": -22.9068, "lng": -43.1729},
        {"name": "Mexico City", "lat": 19.4326, "lng": -99.1332},
        {"name": "Toronto", "lat": 43.6532, "lng": -79.3832},
        {"name": "Buenos Aires", "lat": -34.6037, "lng": -58.3816},
        {"name": "San Francisco", "lat": 37.7749, "lng": -122.4194},
        
        # Middle East & Africa
        {"name": "Dubai", "lat": 25.2048, "lng": 55.2708},
        {"name": "Cairo", "lat": 30.0444, "lng": 31.2357},
        {"name": "Marrakech", "lat": 31.6295, "lng": -7.9811},
        {"name": "Cape Town", "lat": -33.9249, "lng": 18.4241},
        
        # Oceania
        {"name": "Sydney", "lat": -33.8688, "lng": 151.2093},
        {"name": "Auckland", "lat": -36.8485, "lng": 174.7633},
    ]
    
    # 1. Analysis: Select random city
    import random
    location = random.choice(LOCATIONS)
    
    if redis_client:
        await redis_client.publish(channel, f"Analyzing request for topic: {topic}...")
        await redis_client.publish(channel, f"Selected target city: {location['name']}")
    await asyncio.sleep(0.5)
    
    # 3. Generate riddle using Polyglot AI (this uses Groq/Cohere/Gemini intelligently)
    if redis_client:
        await redis_client.publish(channel, "🚀 Invoking Polyglot AI System (Groq + Cohere + Gemini)...")
    await asyncio.sleep(0.5)
    
    if redis_client:
        await redis_client.publish(channel, "Generator agent: Crafting cryptic riddle...")
    
    # Run polyglot AI generation in executor to avoid blocking
    loop = asyncio.get_event_loop()
    riddle_result = await loop.run_in_executor(None, generate_riddle, location["name"])
    
    # Extract riddle and stats
    riddle_text = riddle_result["riddle"]
    stats = riddle_result["stats"]
    
    if redis_client:
        await redis_client.publish(
            channel, 
            f"Adversary agent: Validating riddle quality using {stats['critic_provider'].upper()}..."
        )
    await asyncio.sleep(0.5)
    
    # 4. Final Result
    if redis_client:
        await redis_client.publish(
            channel, 
            f"✅ Riddle generated in {stats['total_time_ms']}ms! (Generator: {stats['generator_provider']}, Critic: {stats['critic_provider']})"
        )
    
    return {
        "riddle": riddle_text,
        "answer": location["name"],
        "difficulty": "Medium",
        "topic": topic,
        "location": {
            "name": location["name"],
            "lat": location["lat"],
            "lng": location["lng"]
        },
        "provider_stats": stats  # Include performance metrics
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