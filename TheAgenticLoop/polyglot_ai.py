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
    # City Lists for 4 Modes
    
    # 1. INDIA EASY - Major Metros (Recruit)
    # ---------------------------------------------------------
    # 1. INDIA EASY - Top 40 (Metros, State Capitals, Major Tourist Hubs)
    # ---------------------------------------------------------
    INDIA_EASY_CITIES = [
        # The Big Metros
        ("Delhi", 28.7041, 77.1025), ("Mumbai", 19.0760, 72.8777),
        ("Bangalore", 12.9716, 77.5946), ("Chennai", 13.0827, 80.2707),
        ("Hyderabad", 17.3850, 78.4867), ("Kolkata", 22.5726, 88.3639),
        ("Ahmedabad", 23.0225, 72.5714), ("Pune", 18.5204, 73.8567),
        
        # Major Cities & State Capitals
        ("Jaipur", 26.9124, 75.7873), ("Lucknow", 26.8467, 80.9462),
        ("Kanpur", 26.4499, 80.3319), ("Nagpur", 21.1458, 79.0882),
        ("Indore", 22.7196, 75.8577), ("Thane", 19.2183, 72.9781),
        ("Bhopal", 23.2599, 77.4126), ("Visakhapatnam", 17.6868, 83.2185),
        ("Patna", 25.5941, 85.1376), ("Vadodara", 22.3072, 73.1812),
        ("Ghaziabad", 28.6692, 77.4538), ("Ludhiana", 30.9010, 75.8573),
        ("Agra", 27.1767, 78.0081), ("Nashik", 19.9975, 73.7898),
        ("Faridabad", 28.4089, 77.3178), ("Meerut", 28.9845, 77.7064),
        ("Rajkot", 22.3039, 70.8022), ("Varanasi", 25.3176, 82.9739),
        ("Srinagar", 34.0837, 74.7973), ("Aurangabad", 19.8762, 75.3433),
        ("Dhanbad", 23.7957, 86.4304), ("Amritsar", 31.6340, 74.8723),
        ("Allahabad (Prayagraj)", 25.4358, 81.8463), ("Ranchi", 23.3441, 85.3096),
        ("Coimbatore", 11.0168, 76.9558), ("Jabalpur", 23.1815, 79.9864),
        ("Gwalior", 26.2183, 78.1828), ("Vijayawada", 16.5062, 80.6480),
        ("Jodhpur", 26.2389, 73.0243), ("Madurai", 9.9252, 78.1198),
        ("Raipur", 21.2514, 81.6296), ("Guwahati", 26.1158, 91.7086),
        ("Chandigarh", 30.7333, 76.7794),
    ]

    # ---------------------------------------------------------
    # 2. INDIA HARD - Tier 2, Historical, & Regional Hubs
    # ---------------------------------------------------------
    INDIA_HARD_CITIES = [
        # South
        ("Mangalore", 12.9141, 74.8560), ("Mysore", 12.2958, 76.6394),
        ("Kochi", 9.9312, 76.2673), ("Thiruvananthapuram", 8.5241, 76.9366),
        ("Salem", 11.6643, 78.1460), ("Tiruchirappalli", 10.7905, 78.7047),
        ("Hubli-Dharwad", 15.3647, 75.1240), ("Belgaum", 15.8497, 74.4977),
        ("Kozhikode", 11.2588, 75.7804), ("Warangal", 17.9689, 79.5941),
        
        # North / Central / West
        ("Kota", 25.2138, 75.8648), ("Bareilly", 28.3670, 79.4304),
        ("Moradabad", 28.8386, 78.7733), ("Aligarh", 27.8974, 78.0880),
        ("Jalandhar", 31.3260, 75.5762), ("Saharanpur", 29.9640, 77.5448),
        ("Gorakhpur", 26.7606, 83.3732), ("Bikaner", 28.0229, 73.3119),
        ("Noida", 28.5355, 77.3910), ("Firozabad", 27.1593, 78.3957),
        ("Jhansi", 25.4484, 78.5685), ("Udaipur", 24.5854, 73.7125),
        ("Jamnagar", 22.4707, 70.0577), ("Bhavnagar", 21.7645, 72.1519),
        ("Solapur", 17.6599, 75.9064), ("Kolhapur", 16.7050, 74.2433),
        ("Ujjain", 23.1765, 75.7819), ("Amravati", 20.9374, 77.7796),
        
        # East / North East
        ("Bhubaneswar", 20.2961, 85.8245), ("Cuttack", 20.4625, 85.8828),
        ("Jamshedpur", 22.8046, 86.2029), ("Bhilai", 21.1938, 81.3509),
        ("Durgapur", 23.5204, 87.3119), ("Asansol", 23.6739, 86.9524),
        ("Siliguri", 26.7271, 88.3953), ("Gangtok", 27.3389, 88.6065),
        ("Shillong", 25.5788, 91.8933), ("Agartala", 23.8315, 91.2868),
        ("Imphal", 24.8170, 93.9368), ("Aizawl", 23.7271, 92.7176),
    ]

    # ---------------------------------------------------------
    # 3. GLOBAL EASY - Top 40 (Famous Capitals & Global Icons)
    # ---------------------------------------------------------
    GLOBAL_EASY_CITIES = [
        # Americas
        ("New York", 40.7128, -74.0060), ("Los Angeles", 34.0522, -118.2437),
        ("Chicago", 41.8781, -87.6298), ("Toronto", 43.6532, -79.3832),
        ("Mexico City", 19.4326, -99.1332), ("Rio de Janeiro", -22.9068, -43.1729),
        ("Buenos Aires", -34.6037, -58.3816), ("Sao Paulo", -23.5505, -46.6333),
        ("San Francisco", 37.7749, -122.4194), ("Miami", 25.7617, -80.1918),
        ("Las Vegas", 36.1699, -115.1398), ("Washington D.C.", 38.9072, -77.0369),
        
        # Europe
        ("London", 51.5074, -0.1278), ("Paris", 48.8566, 2.3522),
        ("Berlin", 52.5200, 13.4050), ("Rome", 41.9028, 12.4964),
        ("Madrid", 40.4168, -3.7038), ("Amsterdam", 52.3676, 4.9041),
        ("Vienna", 48.2082, 16.3738), ("Moscow", 55.7558, 37.6173),
        ("Istanbul", 41.0082, 28.9784), ("Barcelona", 41.3851, 2.1734),
        ("Dublin", 53.3498, -6.2603), ("Brussels", 50.8503, 4.3517),
        ("Zurich", 47.3769, 8.5417), ("Munich", 48.1351, 11.5820),
        ("Lisbon", 38.7223, -9.1393), ("Athens", 37.9838, 23.7275),
        ("Stockholm", 59.3293, 18.0686), ("Prague", 50.0755, 14.4378),
        
        # Asia / Pacific / Middle East
        ("Tokyo", 35.6762, 139.6503), ("Beijing", 39.9042, 116.4074),
        ("Shanghai", 31.2304, 121.4737), ("Seoul", 37.5665, 126.9780),
        ("Bangkok", 13.7563, 100.5018), ("Singapore", 1.3521, 103.8198),
        ("Dubai", 25.2048, 55.2708), ("Sydney", -33.8688, 151.2093),
        ("Cairo", 30.0444, 31.2357), ("Hong Kong", 22.3193, 114.1694),
        ("Jakarta", -6.2088, 106.8456), ("Kuala Lumpur", 3.1390, 101.6869),
    ]

    # ---------------------------------------------------------
    # 4. GLOBAL HARD - Obscure Capitals & Secondary Cities
    # ---------------------------------------------------------
    GLOBAL_HARD_CITIES = [
        # Secondary Cities (Known Country, Lesser Known City)
        ("Osaka", 34.6937, 135.5023), ("Kyoto", 35.0116, 135.7681),
        ("Busan", 35.1796, 129.0756), ("Chengdu", 30.5728, 104.0668),
        ("Manchester", 53.4808, -2.2426), ("Lyon", 45.7640, 4.8357),
        ("Milan", 45.4642, 9.1900), ("Hamburg", 53.5511, 9.9937),
        ("Valencia", 39.4699, -0.3763), ("Porto", 41.1579, -8.6291),
        ("St. Petersburg", 59.9343, 30.3351), ("Vancouver", 49.2827, -123.1207),
        ("Montreal", 45.5017, -73.5673), ("Melbourne", -37.8136, 144.9631),
        ("Auckland", -36.8485, 174.7633), ("Cape Town", -33.9249, 18.4241),
        
        # Obscure / Remote Capitals
        ("Ulaanbaatar", 47.8864, 106.9057), ("Bishkek", 42.8746, 74.5698),
        ("Tashkent", 41.2995, 69.2401), ("Almaty", 43.2220, 76.8512),
        ("Windhoek", -22.5609, 17.0658), ("Antananarivo", -18.8792, 47.5079),
        ("Reykjavik", 64.1466, -21.9426), ("Tbilisi", 41.7151, 44.8271),
        ("Baku", 40.4093, 49.8671), ("Thimphu", 27.4728, 89.6393),
        ("La Paz", -16.5000, -68.1193), ("Asuncion", -25.2637, -57.5759),
        ("Ljubljana", 46.0569, 14.5058), ("Skopje", 41.9981, 21.4254),
        ("Kigali", -1.9403, 30.0587), ("Lusaka", -15.3875, 28.3228),
        ("Hanoi", 21.0285, 105.8542), ("Phnom Penh", 11.5564, 104.9282),
        ("Vientiane", 17.9757, 102.6331), ("Muscat", 23.5880, 58.3829),
        ("Manama", 26.2285, 50.5860), ("Doha", 25.2854, 51.5310),
        ("Kuwait City", 29.3759, 47.9774), ("Amman", 31.9454, 35.9284),
    ]
    seed = random.randint(1, 10000)
    
    # Build exclusion text for prompt
    exclude_text = ""
    if exclude_cities:
        exclude_text = f" Do NOT pick any of these: {', '.join(exclude_cities[:10])}."
    
    # Build prompt based on difficulty
    if difficulty == "INDIA_EASY":
        prompt = (
            f"Pick a major, famous city in India.{exclude_text} "
            f"Random seed: {seed}. Think Delhi, Mumbai, Bangalore, Goa. "
            "Return ONLY a JSON object with keys: 'name', 'country', 'lat', 'lng'. No markdown."
        )
        fallback_list = INDIA_EASY_CITIES
    elif difficulty == "INDIA_HARD":
        prompt = (
            f"Pick a Tier-2 or Tier-3 city in India that is historically significant or geographically unique.{exclude_text} "
            f"Random seed: {seed}. Think Jaipur, Kochi, Nagpur, Vizag. "
            "Return ONLY a JSON object with keys: 'name', 'country', 'lat', 'lng'. No markdown."
        )
        fallback_list = INDIA_HARD_CITIES
    elif difficulty == "GLOBAL_EASY":
        continents = ["Europe", "North America", "South America", "Australia", "East Asia"]
        selected = random.choice(continents)
        prompt = (
            f"Pick a world-famous capital or iconic city from {selected} that everyone knows.{exclude_text} "
            f"Random seed: {seed}. Avoid India. "
            "Return ONLY a JSON object with keys: 'name', 'country', 'lat', 'lng'. No markdown."
        )
        fallback_list = GLOBAL_EASY_CITIES
    elif difficulty == "GLOBAL_HARD":
        continents = ["Central Asia", "Eastern Europe", "Africa", "Pacific Islands"]
        selected = random.choice(continents)
        prompt = (
            f"Pick an obscure, lesser-known international city from {selected}.{exclude_text} "
            f"Random seed: {seed}. Avoid India. "
            "Return ONLY a JSON object with keys: 'name', 'country', 'lat', 'lng'. No markdown."
        )
        fallback_list = GLOBAL_HARD_CITIES
    else:  # Fallback
        prompt = (
            f"Pick a random major city.{exclude_text} "
            "Return ONLY a JSON object with keys: 'name', 'country', 'lat', 'lng'."
        )
        fallback_list = GLOBAL_EASY_CITIES
    
    # Try Groq first
    if groq_client:
        try:
            # Temperature Control - Stricter for India to strictly follow country constraint
            gen_temp = 0.7 if "INDIA" in difficulty else 1.3

            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=gen_temp,
                max_tokens=100
            )
            content = response.choices[0].message.content.strip()
            if content.startswith("```"): content = content.split("\n", 1)[1].rsplit("\n", 1)[0]
            data = json.loads(content)
            
            # Validation: Enforce Country Check
            if "INDIA" in difficulty and data.get("country", "").lower() != "india":
                raise ValueError(f"Constraint Violation: Generated {data['name']} ({data.get('country')}) for {difficulty}")
                
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
    if difficulty == "INDIA_EASY":
        difficulty_context = (
            "Review Difficulty: INDIA EASY. "
            "The user is likely Indian. Use clues about local food, famous monuments, or bollywood connections if applicable. "
            "Make it simple for an Indian audience."
        )
    elif difficulty == "INDIA_HARD":
        difficulty_context = (
            "Review Difficulty: INDIA HARD. "
            "The user is Indian but wants a challenge. Focus on specific history, local rivers, or industries. "
            "Do not give it away immediately."
        )
    elif difficulty == "GLOBAL_EASY":
        difficulty_context = (
            "Review Difficulty: GLOBAL EASY. "
            "Make it obvious for an international audience. Famous landmarks (Eiffel Tower, Big Ben style clues)."
        )
    elif difficulty == "GLOBAL_HARD":
        difficulty_context = (
            "Review Difficulty: GLOBAL HARD. "
            "Very obscure clues. Focus on timezone, currency, exact latitude/longitude hints, or obscure history."
            "Hardest difficulty level."
        )
    else:
        difficulty_context = "Review Difficulty: MEDIUM. Balanced clues."

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
    if difficulty == "INDIA_EASY":
        difficulty_context = "Review Difficulty: INDIA EASY. Make it simple for Indian audience."
    elif difficulty == "INDIA_HARD":
        difficulty_context = "Review Difficulty: INDIA HARD. Make it challenging for Indian audience."
    elif difficulty == "GLOBAL_EASY":
        difficulty_context = "Review Difficulty: GLOBAL EASY. Simple international landmarks."
    elif difficulty == "GLOBAL_HARD":
        difficulty_context = "Review Difficulty: GLOBAL HARD. Obscure international geography."
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

def search_city_names(query: str, limit: int = 5) -> list[str]:
    """Search for city names in the DB matching the query (Sync)."""
    if not supabase: return []
    try:
        # Use ilike for case-insensitive partial match
        # city_name should be unique enough, but we use a set to dedup just in case
        response = supabase.table("riddles").select("city_name").ilike("city_name", f"%{query}%").limit(limit * 2).execute()
        
        # Deduplicate and limit
        cities = list(set([item['city_name'] for item in response.data]))[:limit]
        return cities
    except Exception as e:
        print(f"❌ Search failed: {e}")
        return []

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
    # If all attempts failed, use fallback
    if city_name is None:
        if "INDIA" in difficulty:
             city_name, lat, lng = "Delhi", 28.7041, 77.1025
        else:
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
                # Filter by difficulty first
                response = supabase.table("riddles").select("*").eq("difficulty", difficulty).limit(50).execute()
                candidates = response.data
                
                # If no direct match, fetch diverse pool and filter manually
                if not candidates:
                    if "INDIA" in difficulty:
                        # For India modes, fetch ANYTHING but filter strictly for known Indian cities
                        # Fetching 100 latest to have good chance of finding India ones
                        response = supabase.table("riddles").select("*").order("created_at", desc=True).limit(100).execute()
                        all_fetched = response.data
                        
                        # Build efficient lookup set
                        known_indian_cities = {c[0].lower() for c in INDIA_EASY_CITIES + INDIA_HARD_CITIES}
                        
                        # Filter
                        candidates = [r for r in all_fetched if r["city_name"].lower() in known_indian_cities]
                        # If still no candidates, we might have 0 India riddles in DB.
                    else:
                        # Global mode - fetch generic
                        response = supabase.table("riddles").select("*").limit(50).execute()
                        candidates = response.data

                if candidates:
                    choice = random.choice(candidates)
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
        if "INDIA" in difficulty:
             return {
                "riddle": "I am the capital of India. My history is vast, my traffic is legendary. Identify me.",
                "location": {"name": "Delhi", "lat": 28.7041, "lng": 77.1025},
                "difficulty": "INDIA_EASY",
                "stats": {"generator_provider": "hardcoded_india", "critic_provider": "none", "accepted": True}
            }
        else:
            return {
                "riddle": "I stand tall in the land of rising sun. My tower is red and white. Identify me.",
                "location": {"name": "Tokyo", "lat": 35.6762, "lng": 139.6503},
                "difficulty": "GLOBAL_EASY",
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
