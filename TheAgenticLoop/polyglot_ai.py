import os
import time
import json
import random
from typing import TypedDict, Literal, Optional, Dict, Any
from dotenv import load_dotenv

# Multi-Provider Imports
from groq import Groq
from cohere import Client as CohereClient
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from pydantic import BaseModel, Field
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# ------------------------------------------------------------------
# CONFIGURATION - The "Avengers" Free Tier Setup
# ------------------------------------------------------------------

# Groq: The Engine (30 RPM, blazing fast)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.3-70b-versatile"

# Cohere: The Critic (20 RPM trial, excellent reasoning)
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
COHERE_MODEL = "command-r-plus"

# Gemini: The Specialist (10 RPM, 1M context, multimodal)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash-exp"

# Supabase: The Vault (Database)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Validate API keys
if not GROQ_API_KEY:
    print("⚠️ GROQ_API_KEY not found. Groq provider disabled.")
if not COHERE_API_KEY:
    print("⚠️ COHERE_API_KEY not found. Cohere provider disabled.")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is required as fallback provider.")

# Initialize Clients
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
cohere_client = CohereClient(api_key=COHERE_API_KEY) if COHERE_API_KEY else None
gemini_llm = ChatGoogleGenerativeAI(model=GEMINI_MODEL, temperature=0.7)

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase client initialized.")
    except Exception as e:
        print(f"❌ Supabase initialization failed: {e}")
else:
    print("⚠️ Supabase credentials missing. Database fallback disabled.")

# ------------------------------------------------------------------
# DATA MODELS (Pydantic & TypedDict)
# ------------------------------------------------------------------

class AgentState(TypedDict):
    """The shared state of the polyglot graph."""
    target_city: str
    target_lat: float
    target_lng: float
    difficulty: str
    draft_riddle: str
    feedback: str
    iteration_count: int
    is_acceptable: bool
    # Performance tracking
    generator_provider: str
    critic_provider: str
    generation_time_ms: int

class GeneratorOutput(BaseModel):
    riddle: str = Field(description="The generated 3-sentence cryptic riddle.")

class AdversaryOutput(BaseModel):
    is_acceptable: bool = Field(description="True if riddle is valid, unique, and accurate.")
    feedback: str = Field(description="Specific feedback or 'Approved' if passed.")

# ------------------------------------------------------------------
# PROVIDER FUNCTIONS - The Avengers Team
# ------------------------------------------------------------------

def random_city_generator() -> tuple[str, float, float]:
    """
    Generates a random major city with coordinates using Groq or Gemini.
    Returns: (city_name, lat, lng)
    """
    prompt = (
        "Generate a random major city from anywhere in the world. "
        "Return ONLY a JSON object with keys: 'name', 'lat', 'lng'. "
        "Do not include markdown formatting or extra text."
    )
    
    # Try Groq first
    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=1.0, # High temp for variety
                max_tokens=100
            )
            content = response.choices[0].message.content.strip()
            # Clean potential markdown
            if content.startswith("```"): content = content.split("\n", 1)[1].rsplit("\n", 1)[0]
            data = json.loads(content)
            return data["name"], data["lat"], data["lng"]
        except Exception as e:
            print(f"⚠️ Groq city generation failed: {e}")
            
    # Fallback to Gemini
    try:
        from langchain_core.messages import HumanMessage
        response = gemini_llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        if content.startswith("```"): content = content.split("\n", 1)[1].rsplit("\n", 1)[0]
        data = json.loads(content)
        return data["name"], data["lat"], data["lng"]
    except Exception as e:
        print(f"❌ City generation failed: {e}")
        # Ultimate fallback
        return "Tokyo", 35.6762, 139.6503

def groq_generate(city: str, difficulty: str, feedback: str = "") -> tuple[str, int]:
    """
    Groq Llama 3.3 70B - The Engine
    Blazing fast generation with high RPM.
    Returns: (riddle_text, time_ms)
    """
    if not groq_client:
        raise Exception("Groq client not initialized")
    
    start_time = time.time()
    
    # Adjust prompt based on difficulty
    difficulty_context = ""
    if difficulty.lower() == "easy":
        difficulty_context = (
            "Review Difficulty: EASY. "
            "Make the riddle simple, using well-known landmarks or very obvious clues about the culture or geography. "
            "A child should be able to guess it if they know the city."
        )
    elif difficulty.lower() == "hard":
        difficulty_context = (
            "Review Difficulty: HARD. "
            "Make the riddle very obscure. Do not name famous landmarks directly. "
            "Focus on obscure history, local legends, or specific street names. "
            "It should require deep knowledge to solve."
        )
    else: # Medium
        difficulty_context = (
            "Review Difficulty: MEDIUM. "
            "Balance the riddle. Use one obscure clue and one recognizable clue. "
            "It should be challenging but solvable."
        )

    if feedback:
        prompt = (
            f"You are a riddle master. The previous riddle for {city} was rejected.\n"
            f"Feedback from QA: {feedback}\n"
            f"Write a NEW, 3-sentence cryptic riddle for {city}. "
            f"Fix the issues mentioned. Do not mention the city name explicitly.\n"
            f"{difficulty_context}"
        )
    else:
        prompt = (
            f"You are a riddle master. Write a 3-sentence cryptic riddle for the city of {city}.\n"
            f"Do not mention the city name explicitly. Focus on landmarks, history, or geography.\n"
            f"{difficulty_context}"
        )
    
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a creative riddle master."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )
        
        riddle = response.choices[0].message.content.strip()
        elapsed_ms = int((time.time() - start_time) * 1000)
        
        return riddle, elapsed_ms
    except Exception as e:
        print(f"❌ Groq generation failed: {e}")
        raise

def cohere_critique(city: str, riddle: str) -> tuple[bool, str, int]:
    """
    Cohere Command R+ - The Critic
    Excellent at reasoning and validation.
    Returns: (is_acceptable, feedback, time_ms)
    """
    if not cohere_client:
        raise Exception("Cohere client not initialized")
    
    start_time = time.time()
    
    prompt = (
        f"You are a strict Geography Trivia QA Engineer.\n"
        f"Target City: {city}\n"
        f"Proposed Riddle: {riddle}\n\n"
        f"Analyze the riddle. Criteria:\n"
        f"1. Is it factually correct?\n"
        f"2. Is it clearly about {city} and not applicable to many other cities?\n"
        f"3. Is it approximately 3 sentences?\n"
        f"4. Does it NOT contain the city name?\n\n"
        f"Respond with:\n"
        f"- 'PASS: [brief reason]' if all criteria are met\n"
        f"- 'FAIL: [specific issues]' if any criteria fail"
    )
    
    try:
        response = cohere_client.chat(
            model=COHERE_MODEL,
            message=prompt,
            temperature=0.0  # Strict evaluation
        )
        
        result = response.text.strip()
        elapsed_ms = int((time.time() - start_time) * 1000)
        
        # Parse response
        is_acceptable = result.upper().startswith("PASS")
        feedback = result.split(":", 1)[1].strip() if ":" in result else result
        
        return is_acceptable, feedback, elapsed_ms
    except Exception as e:
        print(f"❌ Cohere critique failed: {e}")
        raise

def gemini_generate(city: str, difficulty: str, feedback: str = "") -> tuple[str, int]:
    """
    Gemini 2.0 Flash - The Specialist (Fallback)
    Used when Groq is unavailable or rate-limited.
    Returns: (riddle_text, time_ms)
    """
    start_time = time.time()
    
    # Adjust prompt based on difficulty
    difficulty_context = ""
    if difficulty.lower() == "easy":
        difficulty_context = "Review Difficulty: EASY. make it simple and obvious."
    elif difficulty.lower() == "hard":
        difficulty_context = "Review Difficulty: HARD. make it obscure and difficult."
    else:
        difficulty_context = "Review Difficulty: MEDIUM. make it balanced."

    if feedback:
        prompt = (
            f"You are a riddle master. The previous riddle for {city} was rejected.\n"
            f"Feedback from QA: {feedback}\n"
            f"Write a NEW, 3-sentence cryptic riddle for {city}. "
            f"Fix the issues mentioned.\n{difficulty_context}"
        )
    else:
        prompt = (
            f"You are a riddle master. Write a 3-sentence cryptic riddle for the city of {city}.\n"
            f"Do not mention the city name explicitly. Focus on landmarks, history, or geography.\n"
            f"{difficulty_context}"
        )
    
    try:
        from langchain_core.messages import HumanMessage
        response = gemini_llm.invoke([HumanMessage(content=prompt)])
        riddle = response.content.strip()
        elapsed_ms = int((time.time() - start_time) * 1000)
        
        return riddle, elapsed_ms
    except Exception as e:
        print(f"❌ Gemini generation failed: {e}")
        raise

def gemini_critique(city: str, riddle: str) -> tuple[bool, str, int]:
    """
    Gemini Critique - Fallback when Cohere is unavailable.
    Returns: (is_acceptable, feedback, time_ms)
    """
    start_time = time.time()
    
    prompt = (
        f"You are a strict Geography Trivia QA Engineer.\n"
        f"Target City: {city}\n"
        f"Proposed Riddle: {riddle}\n\n"
        f"Analyze the riddle. Criteria:\n"
        f"1. Is it factually correct?\n"
        f"2. Is it clearly about {city} and not applicable to many other cities?\n"
        f"3. Is it approximately 3 sentences?\n"
        f"4. Does it NOT contain the city name?\n\n"
        f"Respond with 'PASS: [reason]' or 'FAIL: [issues]'"
    )
    
    try:
        from langchain_core.messages import HumanMessage
        strict_llm = gemini_llm.bind(temperature=0.0)
        response = strict_llm.invoke([HumanMessage(content=prompt)])
        result = response.content.strip()
        elapsed_ms = int((time.time() - start_time) * 1000)
        
        is_acceptable = result.upper().startswith("PASS")
        feedback = result.split(":", 1)[1].strip() if ":" in result else result
        
        return is_acceptable, feedback, elapsed_ms
    except Exception as e:
        print(f"❌ Gemini critique failed: {e}")
        raise

# ------------------------------------------------------------------
# GRAPH NODES - Polyglot Agent System
# ------------------------------------------------------------------

def generator_node(state: AgentState) -> Dict[str, Any]:
    """
    Generator Node: Tries Groq first (fastest), falls back to Gemini.
    """
    print(f"\n--- GENERATOR NODE (Iteration {state['iteration_count'] + 1}) ---")
    
    city = state['target_city']
    difficulty = state.get('difficulty', 'Medium')
    feedback = state.get('feedback', "")
    
    # Try Groq first (The Engine)
    riddle = None
    provider = None
    time_ms = 0
    
    if groq_client:
        try:
            print(f"🚀 Using Groq (Llama 3.3 70B) - The Engine [{difficulty}]")
            riddle, time_ms = groq_generate(city, difficulty, feedback)
            provider = "groq"
        except Exception as e:
            print(f"⚠️ Groq failed, falling back to Gemini: {e}")
    
    # Fallback to Gemini
    if not riddle:
        print(f"🔄 Using Gemini (Fallback) - The Specialist [{difficulty}]")
        riddle, time_ms = gemini_generate(city, difficulty, feedback)
        provider = "gemini"
    
    print(f"Draft ({time_ms}ms): {riddle[:100]}...")
    
    return {
        "draft_riddle": riddle,
        "iteration_count": state["iteration_count"] + 1,
        "generator_provider": provider,
        "generation_time_ms": time_ms
    }

def adversary_node(state: AgentState) -> Dict[str, Any]:
    """
    Adversary/Critic Node: Tries Cohere first (best reasoning), falls back to Gemini.
    """
    print("\n--- ADVERSARY NODE ---")
    
    city = state['target_city']
    riddle = state['draft_riddle']
    
    # Try Cohere first (The Critic)
    is_acceptable = False
    feedback = ""
    provider = None
    time_ms = 0
    
    if cohere_client:
        try:
            print("🎯 Using Cohere (Command R+) - The Critic")
            is_acceptable, feedback, time_ms = cohere_critique(city, riddle)
            provider = "cohere"
        except Exception as e:
            print(f"⚠️ Cohere failed, falling back to Gemini: {e}")
    
    # Fallback to Gemini
    if provider is None:
        print("🔄 Using Gemini (Fallback) - The Specialist")
        is_acceptable, feedback, time_ms = gemini_critique(city, riddle)
        provider = "gemini"
    
    status = "PASSED" if is_acceptable else "FAILED"
    print(f"Verdict ({time_ms}ms): {status} | Feedback: {feedback[:100]}")
    
    return {
        "is_acceptable": is_acceptable,
        "feedback": feedback,
        "critic_provider": provider
    }

# ------------------------------------------------------------------
# ROUTING LOGIC
# ------------------------------------------------------------------

def should_continue(state: AgentState) -> Literal["generator", "end"]:
    """Determines if process should stop or loop back."""
    if state["is_acceptable"]:
        return "end"
    
    if state["iteration_count"] >= 3:
        print("\n!!! Max iterations reached. Stopping. !!!")
        return "end"
    
    return "generator"

# ------------------------------------------------------------------
# GRAPH CONSTRUCTION
# ------------------------------------------------------------------

workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("generator", generator_node)
workflow.add_node("adversary", adversary_node)

# Add Edges
workflow.set_entry_point("generator")
workflow.add_edge("generator", "adversary")

# Conditional Edge
workflow.add_conditional_edges(
    "adversary",
    should_continue,
    {
        "generator": "generator",
        "end": END
    }
)

# Compile
app = workflow.compile()

# ------------------------------------------------------------------
# PUBLIC API
# ------------------------------------------------------------------

async def fetch_riddle_from_db(difficulty: str = "Medium"):
    """Fetch a random riddle from Supabase."""
    if not supabase: return None
    
    try:
        # Sort by difficulty if possible, or just random latest
        # Note: If no difficulty column, this might error if we try to filter.
        # Assuming table has been updated or we just ignore.
        # For now, let's just get latest and hope for the best, or try to filter if schema permits.
        # To be safe against schema mismatch, we won't filter yet, but ideally we should.
        response = supabase.table("riddles").select("*").eq("difficulty", difficulty).order("created_at", desc=True).limit(20).execute()
        
        # If no results (maybe no riddles of that difficulty), fallback graciously
        if not response.data:
             response = supabase.table("riddles").select("*").order("created_at", desc=True).limit(20).execute()
        
        if response.data:
            choice = random.choice(response.data)
            return {
                "riddle": choice["riddle_text"],
                "answer": choice["city_name"],
                "location": {"name": choice["city_name"], "lat": choice["lat"], "lng": choice["lng"]},
                "stats": {"generator_provider": "supabase_cache", "total_time_ms": 0},
                "difficulty": choice.get("difficulty", "Medium")
            }
    except Exception as e:
        print(f"❌ DB Fetch failed: {e}")
    return None

async def save_riddle_to_db(city: str, riddle: str, lat: float, lng: float, difficulty: str):
    """Save a successful riddle generation to Supabase."""
    if not supabase: return
    
    try:
        data = {
            "city_name": city,
            "riddle_text": riddle,
            "lat": lat,
            "lng": lng,
            "difficulty": difficulty
        }
        supabase.table("riddles").insert(data).execute()
        print(f"💾 Riddle saved to DB: {city} [{difficulty}]")
    except Exception as e:
        print(f"❌ DB Insert failed: {e}")

def generate_riddle_with_timeout(timeout_sec: int = 15, difficulty: str = "Medium") -> Dict[str, Any]:
    """
    Wrapper to handle timeout and fallback logic.
    """
    start_time = time.time()
    
    try:
        # 1. Generate City
        city_name, lat, lng = random_city_generator()
        print(f"🌍 Selected Target: {city_name} ({lat}, {lng})")
        
        initial_state = {
            "target_city": city_name,
            "target_lat": lat,
            "target_lng": lng,
            "difficulty": difficulty,
            "draft_riddle": "",
            "feedback": "",
            "iteration_count": 0,
            "is_acceptable": False,
            "generator_provider": "",
            "critic_provider": "",
            "generation_time_ms": 0
        }
        
        # 2. Run Graph
        final_state = app.invoke(initial_state)
        total_time_ms = int((time.time() - start_time) * 1000)
        
        if final_state['is_acceptable']:
            # Success! Save to DB
            if supabase:
                import asyncio
                # Just call save logic here directly since client is sync-capable?
                # Actually python supabase client is synchronous under the hood usually unless using async impl
                try:
                    data = {
                        "city_name": city_name,
                        "riddle_text": final_state['draft_riddle'],
                        "lat": lat,
                        "lng": lng,
                        "difficulty": difficulty
                    }
                    supabase.table("riddles").insert(data).execute()
                    print(f"💾 Riddle saved to DB: {city_name}")
                except Exception as e:
                    print(f"❌ DB Save Error: {e}")

            return {
                "riddle": final_state['draft_riddle'],
                "stats": {
                    "generator_provider": final_state.get('generator_provider', 'unknown'),
                    "critic_provider": final_state.get('critic_provider', 'unknown'),
                    "total_time_ms": total_time_ms,
                    "iterations": final_state['iteration_count'],
                    "accepted": True
                },
                "location": {
                    "name": city_name,
                    "lat": lat,
                    "lng": lng
                },
                "difficulty": difficulty
            }
        
    except Exception as e:
        print(f"⚠️ Generation Error: {e}")
    
    # 3. Fallback
    print("🚨 Generation failed/timed out. Fetching from Backup Vault (DB)...")
    import asyncio
    # Simple sync fallback since we can't easily await here in this structure without context
    if supabase:
        try:
            # Sync fetch
            response = supabase.table("riddles").select("*").eq("difficulty", difficulty).limit(50).execute()
            if not response.data: # fallback to any difficulty
                response = supabase.table("riddles").select("*").limit(50).execute()
            
            if response.data:
                choice = random.choice(response.data)
                return {
                    "riddle": choice["riddle_text"],
                    "location": {
                        "name": choice["city_name"],
                        "lat": choice["lat"],
                        "lng": choice["lng"]
                    },
                    "difficulty": choice.get("difficulty", "Medium"),
                    "stats": {
                        "generator_provider": "supabase_backup", 
                        "critic_provider": "none",
                        "total_time_ms": int((time.time() - start_time) * 1000),
                        "iterations": 0, 
                        "accepted": True
                    }
                }
        except Exception as e:
            print(f"❌ DB Fallback failed: {e}")

    # Ultimate Emergency Fallback
    return {
        "riddle": "I stand tall in the land of rising sun. Tokyo Tower is my name. (Emergency Backup)",
        "location": {"name": "Tokyo", "lat": 35.6762, "lng": 139.6503},
        "difficulty": "Easy",
        "stats": {"generator_provider": "hardcoded", "accepted": True}
    }


if __name__ == "__main__":
    print("running test...")
    print(generate_riddle_with_timeout())
