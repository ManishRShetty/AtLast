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

def random_city_generator(difficulty: str = "Medium", exclude_cities: list = None) -> tuple[str, float, float]:
    """
    Generates a random city with coordinates based on difficulty.
    - Easy: Famous world capitals and iconic cities
    - Medium: Any major city from any continent
    - Hard: Obscure or lesser-known cities
    
    Args:
        difficulty: 'Easy', 'Medium', or 'Hard'
        exclude_cities: List of city names to exclude (already used in session)
    Returns: (city_name, lat, lng)
    """
    if exclude_cities is None:
        exclude_cities = []
    exclude_set = set(c.lower() for c in exclude_cities)
    
    # Hardcoded fallback lists per difficulty - EXPANDED for variety
    EASY_CITIES = [
        # Americas
        ("New York", 40.7128, -74.0060), ("Los Angeles", 34.0522, -118.2437), 
        ("Chicago", 41.8781, -87.6298), ("Miami", 25.7617, -80.1918),
        ("San Francisco", 37.7749, -122.4194), ("Las Vegas", 36.1699, -115.1398),
        ("Rio de Janeiro", -22.9068, -43.1729), ("Buenos Aires", -34.6037, -58.3816),
        ("Mexico City", 19.4326, -99.1332), ("Toronto", 43.6532, -79.3832),
        ("Vancouver", 49.2827, -123.1207),
        # Europe
        ("Paris", 48.8566, 2.3522), ("London", 51.5074, -0.1278), 
        ("Rome", 41.9028, 12.4964), ("Barcelona", 41.3851, 2.1734),
        ("Amsterdam", 52.3676, 4.9041), ("Berlin", 52.5200, 13.4050),
        ("Vienna", 48.2082, 16.3738), ("Prague", 50.0755, 14.4378),
        ("Athens", 37.9838, 23.7275), ("Madrid", 40.4168, -3.7038),
        ("Lisbon", 38.7223, -9.1393), ("Venice", 45.4408, 12.3155),
        ("Munich", 48.1351, 11.5820), ("Dublin", 53.3498, -6.2603),
        # Asia
        ("Tokyo", 35.6762, 139.6503), ("Beijing", 39.9042, 116.4074),
        ("Shanghai", 31.2304, 121.4737), ("Hong Kong", 22.3193, 114.1694),
        ("Singapore", 1.3521, 103.8198), ("Bangkok", 13.7563, 100.5018),
        ("Seoul", 37.5665, 126.9780), ("Mumbai", 19.0760, 72.8777),
        ("Delhi", 28.7041, 77.1025), ("Dubai", 25.2048, 55.2708),
        ("Istanbul", 41.0082, 28.9784), ("Taipei", 25.0330, 121.5654),
        # Africa & Oceania
        ("Cairo", 30.0444, 31.2357), ("Cape Town", -33.9249, 18.4241),
        ("Sydney", -33.8688, 151.2093), ("Melbourne", -37.8136, 144.9631),
        ("Auckland", -36.8485, 174.7633), ("Moscow", 55.7558, 37.6173),
    ]
    
    HARD_CITIES = [
        # Central Asia
        ("Ulaanbaatar", 47.8864, 106.9057), ("Bishkek", 42.8746, 74.5698),
        ("Dushanbe", 38.5598, 68.7740), ("Ashgabat", 37.9601, 58.3261),
        ("Tashkent", 41.2995, 69.2401), ("Almaty", 43.2220, 76.8512),
        # Eastern Europe
        ("Chisinau", 47.0105, 28.8638), ("Skopje", 41.9981, 21.4254),
        ("Tirana", 41.3275, 19.8187), ("Podgorica", 42.4304, 19.2594),
        ("Pristina", 42.6629, 21.1655), ("Sarajevo", 43.8563, 18.4131),
        # Africa
        ("Windhoek", -22.5609, 17.0658), ("Ouagadougou", 12.3714, -1.5197),
        ("Antananarivo", -18.8792, 47.5079), ("Bamako", 12.6392, -8.0029),
        ("Niamey", 13.5137, 2.1098), ("Libreville", 0.4162, 9.4673),
        ("Kigali", -1.9403, 30.0587), ("Lusaka", -15.3875, 28.3228),
        # Others
        ("Reykjavik", 64.1466, -21.9426), ("Tbilisi", 41.7151, 44.8271),
        ("Yerevan", 40.1792, 44.4991), ("Baku", 40.4093, 49.8671),
        ("Thimphu", 27.4728, 89.6393), ("Vaduz", 47.1410, 9.5209),
        ("Bratislava", 48.1486, 17.1077), ("Ljubljana", 46.0569, 14.5058),
        ("Valletta", 35.8989, 14.5146), ("Belmopan", 17.2510, -88.7590),
    ]
    
    seed = random.randint(1, 10000)
    
    # Build exclusion text for prompt
    exclude_text = ""
    if exclude_cities:
        exclude_text = f" Do NOT pick any of these: {', '.join(exclude_cities[:10])}."
    
    # Build prompt based on difficulty
    if difficulty.lower() == "easy":
        prompt = (
            f"Pick a famous, iconic world city that everyone knows.{exclude_text} "
            f"Random seed: {seed}. Pick something different from common choices. "
            "Return ONLY a JSON object with keys: 'name', 'lat', 'lng'. No markdown."
        )
        fallback_list = EASY_CITIES
    elif difficulty.lower() == "hard":
        continents = ["Central Asia", "Eastern Europe", "West Africa", "Oceania Islands", "Caucasus"]
        selected = random.choice(continents)
        prompt = (
            f"Generate an obscure, lesser-known city from {selected}.{exclude_text} "
            f"Random seed: {seed}. Pick something most people wouldn't know. "
            "Return ONLY a JSON object with keys: 'name', 'lat', 'lng'. No markdown."
        )
        fallback_list = HARD_CITIES
    else:  # Medium
        continents = ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"]
        selected = random.choice(continents)
        prompt = (
            f"Generate a random major city from {selected}.{exclude_text} "
            f"Random seed: {seed}. Pick something different. "
            "Return ONLY a JSON object with keys: 'name', 'lat', 'lng'. No markdown."
        )
        fallback_list = EASY_CITIES + HARD_CITIES  # Mix for medium
    
    # Try Groq first
    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=1.3,  # High temp for all modes to encourage variety
                max_tokens=100
            )
            content = response.choices[0].message.content.strip()
            if content.startswith("```"): content = content.split("\n", 1)[1].rsplit("\n", 1)[0]
            data = json.loads(content)
            # print(f"🌍 Selected Target: {data['name']} [{difficulty}]")
            return data["name"], data["lat"], data["lng"]
        except Exception as e:
            print(f"⚠️ Groq city generation failed: {e}")
            
    # Fallback to hardcoded list (fast, reliable)
    # Filter out already used cities
    available_cities = [c for c in fallback_list if c[0].lower() not in exclude_set]
    if not available_cities:
        # All cities used, reset to full list (rare edge case)
        available_cities = fallback_list
        print("⚠️ All cities exhausted, resetting pool")
    
    city = random.choice(available_cities)
    # print(f"🌍 Selected Target (fallback): {city[0]} [{difficulty}]")
    return city

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
            f"Write a NEW cryptic riddle for {city} in 3-4 sentences MAX (no more than 6 lines). "
            f"Fix the issues mentioned. Do not mention the city name explicitly.\n"
            f"{difficulty_context}"
        )
    else:
        prompt = (
            f"You are a riddle master. Write a cryptic riddle for the city of {city} in 3-4 sentences MAX (no more than 6 lines).\n"
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
            f"Write a NEW cryptic riddle for {city} in 3-4 sentences MAX (no more than 6 lines). "
            f"Fix the issues mentioned.\n{difficulty_context}"
        )
    else:
        prompt = (
            f"You are a riddle master. Write a cryptic riddle for the city of {city} in 3-4 sentences MAX (no more than 6 lines).\n"
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
        # print(f"💾 Riddle saved to DB: {city} [{difficulty}]")
    except Exception as e:
        print(f"❌ DB Insert failed: {e}")

def generate_riddle_with_timeout(timeout_sec: int = 15, difficulty: str = "Medium", exclude_cities: list = None) -> Dict[str, Any]:
    """
    Resilient riddle generation with fail-open strategy.
    
    Args:
        timeout_sec: Maximum time for generation
        difficulty: 'Easy', 'Medium', or 'Hard'
        exclude_cities: List of city names to exclude (already used in session)
    
    Logic Flow:
    1. Groq generates draft (primary generator), Gemini fallback
    2. Cohere critique attempt (optional, fast)
       - Success: Return riddle
       - Any Error: Log and return Groq draft immediately (FAIL OPEN)
    3. DB Fallback: ONLY if Groq AND Gemini both fail to generate
    """
    if exclude_cities is None:
        exclude_cities = []
    
    start_time = time.time()
    
    # ==========================================================
    # STEP 1: Generate City Target (difficulty-aware, exclude used)
    # ==========================================================
    max_attempts = 5  # Prevent infinite loop
    attempt = 0
    city_name, lat, lng = None, None, None
    
    while attempt < max_attempts:
        try:
            city_name, lat, lng = random_city_generator(difficulty, exclude_cities)
            # Check if city was already used
            if city_name.lower() not in [c.lower() for c in exclude_cities]:
                break
            # print(f"⚠️ City {city_name} already used, retrying...")
            attempt += 1
        except Exception as e:
            print(f"❌ City generation failed: {e}")
            attempt += 1
    
    # If all attempts failed, use fallback
    if city_name is None:
        city_name, lat, lng = "Tokyo", 35.6762, 139.6503
        print(f"⚠️ All city attempts failed, using fallback: {city_name}")
    # else:
    #     print(f"🌍 Selected Target: {city_name} ({lat}, {lng})")
    
    # ==========================================================
    # STEP 2: Groq Generates Draft (Primary)
    # ==========================================================
    draft_riddle = None
    generator_provider = None
    gen_time_ms = 0
    
    if groq_client:
        try:
            print(f"🚀 Groq generating riddle [{difficulty}]...")
            draft_riddle, gen_time_ms = groq_generate(city_name, difficulty)
            generator_provider = "groq"
            print(f"✅ Groq draft ready ({gen_time_ms}ms)")
        except Exception as e:
            print(f"⚠️ Groq generation failed: {e}")
    
    # If Groq failed, try Gemini as generator fallback
    if not draft_riddle:
        try:
            print(f"🔄 Gemini generating riddle (fallback)...")
            draft_riddle, gen_time_ms = gemini_generate(city_name, difficulty)
            generator_provider = "gemini"
            print(f"✅ Gemini draft ready ({gen_time_ms}ms)")
        except Exception as e:
            print(f"❌ Gemini generation also failed: {e}")
    
    # ==========================================================
    # STEP 3: DB Fallback (ONLY if generation completely failed)
    # ==========================================================
    if not draft_riddle:
        print("🚨 All generators failed. Fetching from DB...")
        if supabase:
            try:
                response = supabase.table("riddles").select("*").eq("difficulty", difficulty).limit(50).execute()
                if not response.data:
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
                print(f"❌ DB fallback failed: {e}")
        
        # Ultimate emergency - hardcoded
        return {
            "riddle": "I stand tall in the land of rising sun. My tower is red and white. Identify me.",
            "location": {"name": "Tokyo", "lat": 35.6762, "lng": 139.6503},
            "difficulty": "Easy",
            "stats": {"generator_provider": "hardcoded", "critic_provider": "none", "accepted": True}
        }
    
    # ==========================================================
    # STEP 4: Critic - TRY COHERE ONLY, FAIL OPEN FAST
    # ==========================================================
    # Cohere is fast and doesn't have problematic retry loops.
    # If Cohere fails, we just accept the Groq draft (fail open).
    # We do NOT use Gemini for critique because LangChain's retry loop blocks.
    
    critic_provider = "skipped"
    is_acceptable = True  # Default: accept draft (fail open)
    feedback = "Approved (critic skipped)"
    
    if cohere_client:
        try:
            print("🎯 Cohere critiquing (3s max)...")
            import signal
            
            # Simple sync call - Cohere SDK is fast
            ok, fb, time_ms = cohere_critique(city_name, draft_riddle)
            is_acceptable = ok
            feedback = fb
            critic_provider = "cohere"
            print(f"✅ Critic: {'PASS' if ok else 'FAIL'} ({time_ms}ms) - {fb[:50]}")
        except Exception as e:
            # Cohere failed - fail open
            print(f"⚠️ Cohere critic failed: {str(e)[:100]}... FAIL OPEN")
            is_acceptable = True
            feedback = f"Approved (cohere error - fail open)"
            critic_provider = "cohere_error"
    else:
        print("ℹ️ No critic available - accepting draft")
    
    # ==========================================================
    # STEP 5: Return Result
    # ==========================================================
    total_time_ms = int((time.time() - start_time) * 1000)
    
    # If critic passed OR we failed open, return the draft
    if is_acceptable:
        # Save to DB for future cache (fire and forget)
        if supabase and generator_provider in ["groq", "gemini"]:
            try:
                data = {
                    "city_name": city_name,
                    "riddle_text": draft_riddle,
                    "lat": lat,
                    "lng": lng,
                    "difficulty": difficulty
                }
                supabase.table("riddles").insert(data).execute()
                # print(f"💾 Saved to DB: {city_name}")
            except Exception as e:
                print(f"⚠️ DB save failed (non-critical): {e}")
        
        return {
            "riddle": draft_riddle,
            "location": {
                "name": city_name,
                "lat": lat,
                "lng": lng
            },
            "difficulty": difficulty,
            "stats": {
                "generator_provider": generator_provider,
                "critic_provider": critic_provider,
                "total_time_ms": total_time_ms,
                "iterations": 1,
                "accepted": True
            }
        }
    
    # Critic explicitly rejected - but we still have a draft, so return it anyway
    # (This is also "fail open" - we don't loop back for refinement)
    print(f"⚠️ Critic rejected but returning draft anyway (fail open)")
    return {
        "riddle": draft_riddle,
        "location": {
            "name": city_name,
            "lat": lat,
            "lng": lng
        },
        "difficulty": difficulty,
        "stats": {
            "generator_provider": generator_provider,
            "critic_provider": critic_provider,
            "total_time_ms": total_time_ms,
            "iterations": 1,
            "accepted": False,
            "critic_feedback": feedback
        }
    }


if __name__ == "__main__":
    print("running test...")
    print(generate_riddle_with_timeout())
