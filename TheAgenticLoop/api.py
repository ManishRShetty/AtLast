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
from pydantic import BaseModel
try:
    from fakeredis import FakeAsyncRedis
    FAKEREDIS_AVAILABLE = True
except ImportError:
    FAKEREDIS_AVAILABLE = False

# Import Polyglot AI riddle generator (multi-provider: Groq, Cohere, Gemini)
# Import Polyglot AI riddle generator (multi-provider: Groq, Cohere, Gemini)
from polyglot_ai import generate_riddle_with_timeout, search_city_names

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
        # Try connecting to real Redis
        client = redis.from_url(REDIS_URL, decode_responses=True)
        await client.ping()
        print(f"✅ Connected to Real Redis at {REDIS_URL}")
        redis_client = client
    except Exception as e:
        print(f"⚠️ Failed to connect to Real Redis: {e}")
        
        if FAKEREDIS_AVAILABLE:
            print("🚀 Switching to In-Memory Redis (FakeRedis)...")
            # Create a shared state for FakeRedis
            redis_client = FakeAsyncRedis(decode_responses=True)
            print("✅ Connected to FakeRedis (In-Memory)")
        else:
            print("❌ FakeRedis not installed. App will fail.")
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


# ==========================================
# AGENTIC WORKERS
# ==========================================

async def agent_riddle_generation(session_id: str, difficulty: str = "Medium", topic: str = "Geography") -> Dict[str, Any]:
    """
    Real Agentic Workflow (Polyglot AI + Supabase).
    1. Publishes thought logs to Redis Pub/Sub.
    2. Generates city + riddle using AI (with difficulty level).
    3. Handles fallback to Supabase if generation fails.
    """
    channel = f"{LOG_CHANNEL_PREFIX}:{session_id}"
    
    # ------------------------------------------------------------------
    # AGENTIC WORKFLOW
    # ------------------------------------------------------------------
    
    # Get already used cities for this session (to avoid repeats)
    used_cities = []
    if redis_client:
        used_cities_key = f"used_cities:{session_id}"
        used_cities = await redis_client.smembers(used_cities_key) or []
        used_cities = list(used_cities)
        if used_cities:
            await redis_client.publish(channel, f"Excluding {len(used_cities)} previously visited targets...")
    
    # 1. Agent: Select Target City (AI Generated)
    if redis_client:
        await redis_client.publish(channel, f"Mission Control: Scouting global targets related to {topic} [Difficulty: {difficulty.upper()}]...")
    await asyncio.sleep(0.5)

    # 2. Agent: Generate Riddle (Polyglot System + DB Fallback)
    if redis_client:
        await redis_client.publish(channel, "🚀 Invoking Polyglot AI System (Groq + Cohere + Gemini)...")
    await asyncio.sleep(0.3)
    
    # Run in executor to avoid blocking the event loop
    loop = asyncio.get_event_loop()
    from polyglot_ai import generate_riddle_with_timeout
    
    # This function now handles: Dynamic City, Difficulty, Riddle Gen, Validation, DB Fallback/Save
    # We pass difficulty and used_cities to it.
    riddle_result = await loop.run_in_executor(
        None, 
        lambda: generate_riddle_with_timeout(15, difficulty, used_cities)
    )
    
    # Extract data
    riddle_text = riddle_result["riddle"]
    stats = riddle_result["stats"]
    location = riddle_result["location"]
    
    # Track this city as used for this session
    if redis_client and location.get("name"):
        used_cities_key = f"used_cities:{session_id}"
        await redis_client.sadd(used_cities_key, location["name"])
        # Set expiry to match session (1 hour)
        await redis_client.expire(used_cities_key, 3600)
    
    # Log the result
    if redis_client:
        # Check if fallback was used
        if stats["generator_provider"] in ["supabase_backup", "supabase_cache"]:
            await redis_client.publish(channel, f"⚠️ Generation slow. Fetched from Secure Vault (Supabase).")
        else:
            await redis_client.publish(
                channel, 
                f"✅ Target Locked. Riddle generated in {stats['total_time_ms']}ms!"
            )
            await redis_client.publish(
                channel,
                f"📊 Stats: Gen={stats['generator_provider']}, Critic={stats['critic_provider']}"
            )

    return {
        "riddle": riddle_text,
        "answer": location["name"],
        "difficulty": difficulty,
        "topic": topic,
        "location": location,
        "provider_stats": stats
    }

async def buffer_worker(session_id: str, difficulty: str = "Medium", count: int = 1):
    """
    Background Task:
    Generates 'count' questions and pushes them to the Redis List (Queue).
    """
    if not redis_client:
        print("❌ Worker failed: No Redis connection")
        return

    print(f"⚙️ Background Task: Generating {count} questions for {session_id} [Difficulty: {difficulty}]")
    
    for _ in range(count):
        # Generate the content (Slow operation)
        riddle_data = await agent_riddle_generation(session_id, difficulty)
        
        # Serialize and Push to Redis List (Right Push)
        queue_key = f"{QUEUE_PREFIX}:{session_id}"
        await redis_client.rpush(queue_key, json.dumps(riddle_data))
        
        print(f"✅ Buffered question for {session_id}")

# ==========================================
# ENDPOINTS
# ==========================================


class StartSessionRequest(BaseModel):
    difficulty: str = "Medium" # Default if not provided

@app.post("/start_session")
async def start_session(request: Request, background_tasks: BackgroundTasks):
    """
    Initializes a user session with a specific difficulty.
    """
    # Parse body manually or use Pydantic model above if we change signature
    # But since we used Request before, let's stick to it or switch to Body
    try:
        body = await request.json()
        difficulty = body.get("difficulty", "Medium")
    except Exception as e:
        print(f"❌ Error parsing start_session body: {e}")
        difficulty = "Medium"

    print(f"🔔 START_SESSION Received Difficulty: [{difficulty}]")

    session_id = str(uuid.uuid4())
    
    # Store session config (difficulty) in Redis so we know what to generate later
    if redis_client:
        config_key = f"config:{session_id}"
        await redis_client.hset(config_key, mapping={"difficulty": difficulty})
        await redis_client.expire(config_key, 3600) # 1 hour session

    # Fire and forget: Fill the buffer immediately
    background_tasks.add_task(buffer_worker, session_id, difficulty, BUFFER_SIZE)
    
    return {
        "session_id": session_id,
        "status": "initializing",
        "message": f"Session started [{difficulty}]. Agents are pre-fetching content."
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
        # Retrieve difficulty from config
        config_key = f"config:{session_id}"
        difficulty = await redis_client.hget(config_key, "difficulty")
        if not difficulty: difficulty = "Medium"
        
        background_tasks.add_task(buffer_worker, session_id, difficulty, 1)
        
        return {
            "status": "ready",
            "data": data,
            "queue_status": "refilling"
        }
    
    else:
        # === CACHE MISS ===
        # The user consumed content faster than we generated, or this is a cold start.
        config_key = f"config:{session_id}"
        difficulty = await redis_client.hget(config_key, "difficulty")
        if not difficulty: difficulty = "Medium"
        
        background_tasks.add_task(buffer_worker, session_id, difficulty, 1)
        
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
        return {
            "correct": False,
            "attempts": attempts,
            "message": "Incorrect answer. Try again!"
        }

@app.get("/search_city")
async def search_city(q: str):
    """
    Search for city names in the DB matching the query.
    Used for autocomplete suggestions.
    """
    if not q:
        return {"results": []}

    loop = asyncio.get_event_loop()
    # search_city_names is synchronous (uses blocking supabase client), run in executor
    results = await loop.run_in_executor(None, lambda: search_city_names(q))
    return {"results": results}

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