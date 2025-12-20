import os
import time
from typing import TypedDict, Literal, Optional, Dict, Any
from dotenv import load_dotenv

# Multi-Provider Imports
from groq import Groq
from cohere import Client as CohereClient
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from pydantic import BaseModel, Field

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

# ------------------------------------------------------------------
# DATA MODELS (Pydantic & TypedDict)
# ------------------------------------------------------------------

class AgentState(TypedDict):
    """The shared state of the polyglot graph."""
    target_city: str
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

def groq_generate(city: str, feedback: str = "") -> tuple[str, int]:
    """
    Groq Llama 3.3 70B - The Engine
    Blazing fast generation with high RPM.
    Returns: (riddle_text, time_ms)
    """
    if not groq_client:
        raise Exception("Groq client not initialized")
    
    start_time = time.time()
    
    if feedback:
        prompt = (
            f"You are a riddle master. The previous riddle for {city} was rejected.\n"
            f"Feedback from QA: {feedback}\n"
            f"Write a NEW, 3-sentence cryptic riddle for {city}. "
            f"Fix the issues mentioned. Do not mention the city name explicitly."
        )
    else:
        prompt = (
            f"You are a riddle master. Write a 3-sentence cryptic riddle for the city of {city}.\n"
            f"Do not mention the city name explicitly. Focus on landmarks, history, or geography."
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

def gemini_generate(city: str, feedback: str = "") -> tuple[str, int]:
    """
    Gemini 2.0 Flash - The Specialist (Fallback)
    Used when Groq is unavailable or rate-limited.
    Returns: (riddle_text, time_ms)
    """
    start_time = time.time()
    
    if feedback:
        prompt = (
            f"You are a riddle master. The previous riddle for {city} was rejected.\n"
            f"Feedback from QA: {feedback}\n"
            f"Write a NEW, 3-sentence cryptic riddle for {city}. "
            f"Fix the issues mentioned."
        )
    else:
        prompt = (
            f"You are a riddle master. Write a 3-sentence cryptic riddle for the city of {city}.\n"
            f"Do not mention the city name explicitly. Focus on landmarks, history, or geography."
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
    feedback = state.get('feedback', "")
    
    # Try Groq first (The Engine)
    riddle = None
    provider = None
    time_ms = 0
    
    if groq_client:
        try:
            print("🚀 Using Groq (Llama 3.3 70B) - The Engine")
            riddle, time_ms = groq_generate(city, feedback)
            provider = "groq"
        except Exception as e:
            print(f"⚠️ Groq failed, falling back to Gemini: {e}")
    
    # Fallback to Gemini
    if not riddle:
        print("🔄 Using Gemini (Fallback) - The Specialist")
        riddle, time_ms = gemini_generate(city, feedback)
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

def generate_riddle(city_name: str) -> Dict[str, Any]:
    """
    Generate a cryptic riddle using the polyglot multi-agent system.
    
    Args:
        city_name: Name of the city to generate a riddle for
        
    Returns:
        Dict containing:
        - riddle: The generated riddle text
        - stats: Performance metrics (providers used, time taken)
    """
    initial_state = {
        "target_city": city_name,
        "draft_riddle": "",
        "feedback": "",
        "iteration_count": 0,
        "is_acceptable": False,
        "generator_provider": "",
        "critic_provider": "",
        "generation_time_ms": 0
    }
    
    total_start = time.time()
    final_state = app.invoke(initial_state)
    total_time_ms = int((time.time() - total_start) * 1000)
    
    return {
        "riddle": final_state['draft_riddle'],
        "stats": {
            "generator_provider": final_state.get('generator_provider', 'unknown'),
            "critic_provider": final_state.get('critic_provider', 'unknown'),
            "total_time_ms": total_time_ms,
            "iterations": final_state['iteration_count'],
            "accepted": final_state['is_acceptable']
        }
    }

# ------------------------------------------------------------------
# EXECUTION & TESTING
# ------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("POLYGLOT AGENTIC WORKFLOW - Speed Test")
    print("=" * 60)
    print(f"🚀 Groq Provider: {'✅ Active' if groq_client else '❌ Disabled'}")
    print(f"🎯 Cohere Provider: {'✅ Active' if cohere_client else '❌ Disabled'}")
    print(f"🔄 Gemini Provider: ✅ Active (Fallback)")
    print("=" * 60)
    
    test_city = "Kyoto"
    
    print(f"\nGenerating riddle for: {test_city}")
    print("-" * 60)
    
    result = generate_riddle(test_city)
    
    print("\n" + "=" * 60)
    print("FINAL RESULT")
    print("=" * 60)
    print(f"✅ Riddle: {result['riddle']}")
    print(f"\n📊 Performance Stats:")
    print(f"   - Generator: {result['stats']['generator_provider']}")
    print(f"   - Critic: {result['stats']['critic_provider']}")
    print(f"   - Total Time: {result['stats']['total_time_ms']}ms")
    print(f"   - Iterations: {result['stats']['iterations']}")
    print(f"   - Accepted: {result['stats']['accepted']}")
    print("=" * 60)
