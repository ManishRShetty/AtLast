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
    2. Returns the final JSON payload.
    """
    channel = f"{LOG_CHANNEL_PREFIX}:{session_id}"
    
    # 1. Simulation: Initial Analysis
    if redis_client:
        await redis_client.publish(channel, f"Analyzing request for topic: {topic}...")
    await asyncio.sleep(1.0) # Simulate LLM latency
    
    # 2. Simulation: Tool Usage
    if redis_client:
        await redis_client.publish(channel, "Searching internal database for riddles...")
    await asyncio.sleep(1.0) 
    
    # 3. Simulation: Verification
    if redis_client:
        await redis_client.publish(channel, "Verifying riddle ambiguity and difficulty...")
    await asyncio.sleep(1.0)
    
    # 4. Final Result
    if redis_client:
        await redis_client.publish(channel, "Generation complete.")
    
    # Randomize slightly to prove it's working
    unique_suffix = str(uuid.uuid4())[:4]
    return {
        "riddle": f"I have cities, but no houses. I have mountains, but no trees. What am I? (ID: {unique_suffix})",
        "answer": "A Map",
        "difficulty": "Easy",
        "topic": topic
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