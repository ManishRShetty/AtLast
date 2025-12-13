import os
from typing import TypedDict, Literal, Optional
from dotenv import load_dotenv

# LangChain / LangGraph Imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

# ------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------
if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

# Initialize the Gemini Model
# We use temperature=0.7 for the generator (creativity) 
# and temperature=0.0 for the adversary (strict logic).
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)

# ------------------------------------------------------------------
# DATA MODELS (Pydantic & TypedDict)
# ------------------------------------------------------------------

# 1. Graph State
class AgentState(TypedDict):
    """
    The shared state of the graph.
    """
    target_city: str
    draft_riddle: str
    feedback: str
    iteration_count: int
    is_acceptable: bool

# 2. Structured Outputs for Agents
class GeneratorOutput(BaseModel):
    riddle: str = Field(description="The generated 3-sentence cryptic riddle.")

class AdversaryOutput(BaseModel):
    is_acceptable: bool = Field(description="True if the riddle is valid, unique, and accurate. False otherwise.")
    feedback: str = Field(description="Specific feedback on why the riddle failed, or 'Approved' if passed.")

# ------------------------------------------------------------------
# NODES (AGENTS)
# ------------------------------------------------------------------

def generator_node(state: AgentState):
    """
    Generates a riddle. Incorporates feedback if this is a retry.
    """
    print(f"\n--- GENERATOR NODE (Iteration {state['iteration_count'] + 1}) ---")
    
    city = state['target_city']
    feedback = state.get('feedback', "")
    
    # Dynamic prompting based on state
    if feedback:
        system_prompt = (
            f"You are a riddle master. The previous riddle for {city} was rejected.\n"
            f"Feedback from QA: {feedback}\n"
            f"Write a NEW, 3-sentence cryptic riddle for {city}. "
            f"Fix the issues mentioned."
        )
    else:
        system_prompt = (
            f"You are a riddle master. Write a 3-sentence cryptic riddle for the city of {city}.\n"
            f"Do not mention the city name explicitly. "
            f"Focus on landmarks, history, or geography."
        )

    # Enforce structured output
    structured_llm = llm.with_structured_output(GeneratorOutput)
    response = structured_llm.invoke(system_prompt)

    print(f"Draft: {response.riddle}")

    return {
        "draft_riddle": response.riddle,
        "iteration_count": state["iteration_count"] + 1
    }

def adversary_node(state: AgentState):
    """
    Critiques the riddle. Checks for ambiguity, factual correctness, and difficulty.
    """
    print("\n--- ADVERSARY NODE ---")
    
    city = state['target_city']
    riddle = state['draft_riddle']

    system_prompt = (
        f"You are a strict Geography Trivia QA Engineer.\n"
        f"Target City: {city}\n"
        f"Proposed Riddle: {riddle}\n\n"
        f"Analyze the riddle. Criteria:\n"
        f"1. Is it factually correct?\n"
        f"2. Is it clearly about {city} and not applicable to many other cities?\n"
        f"3. Is it approximately 3 sentences?\n"
        f"4. Does it NOT contain the city name?\n\n"
        f"Provide a boolean pass/fail and specific constructive feedback."
    )

    # Enforce structured output (Low temp for strictness)
    strict_llm = llm.bind(temperature=0.0).with_structured_output(AdversaryOutput)
    response = strict_llm.invoke(system_prompt)

    status = "PASSED" if response.is_acceptable else "FAILED"
    print(f"Verdict: {status} | Feedback: {response.feedback}")

    return {
        "is_acceptable": response.is_acceptable,
        "feedback": response.feedback
    }

# ------------------------------------------------------------------
# EDGES (ROUTING LOGIC)
# ------------------------------------------------------------------

def should_continue(state: AgentState) -> Literal["generator", "end"]:
    """
    Determines if the process should stop or loop back to the generator.
    """
    if state["is_acceptable"]:
        return "end"
    
    if state["iteration_count"] >= 3:
        print("\n!!! Max iterations reached. Stopping to prevent infinite loop. !!!")
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
# EXECUTION
# ------------------------------------------------------------------

if __name__ == "__main__":
    # Test Case 1: A distinct city
    test_city = "Kyoto"
    
    initial_state = {
        "target_city": test_city,
        "draft_riddle": "",
        "feedback": "",
        "iteration_count": 0,
        "is_acceptable": False
    }

    print(f"Starting process for: {test_city}")
    final_state = app.invoke(initial_state)

    print("\n\n=== FINAL RESULT ===")
    if final_state['is_acceptable']:
        print(f"✅ SUCCESS for {final_state['target_city']}!")
        print(f"Riddle: {final_state['draft_riddle']}")
    else:
        print(f"❌ FAILED for {final_state['target_city']}.")
        print(f"Last Draft: {final_state['draft_riddle']}")
        print(f"Reason: {final_state['feedback']}")