"""
Quick verification script for Polyglot AI setup.
Tests each provider individually and displays status.
"""

import os
from dotenv import load_dotenv

load_dotenv()

def check_api_keys():
    """Check which API keys are configured."""
    print("=" * 60)
    print("POLYGLOT AI - API KEY VERIFICATION")
    print("=" * 60)
    
    groq_key = os.getenv("GROQ_API_KEY")
    cohere_key = os.getenv("COHERE_API_KEY")
    gemini_key = os.getenv("GOOGLE_API_KEY")
    
    results = []
    
    print("\n📋 Checking Environment Variables...")
    print("-" * 60)
    
    if groq_key:
        print("✅ GROQ_API_KEY: Found")
        results.append(("Groq", True))
    else:
        print("❌ GROQ_API_KEY: Missing")
        results.append(("Groq", False))
    
    if cohere_key:
        print("✅ COHERE_API_KEY: Found")
        results.append(("Cohere", True))
    else:
        print("❌ COHERE_API_KEY: Missing")
        results.append(("Cohere", False))
    
    if gemini_key:
        print("✅ GOOGLE_API_KEY: Found")
        results.append(("Gemini", True))
    else:
        print("❌ GOOGLE_API_KEY: Missing (REQUIRED!)")
        results.append(("Gemini", False))
    
    return results

def test_providers(results):
    """Test actual API connections."""
    print("\n🔌 Testing API Connections...")
    print("-" * 60)
    
    # Test Groq
    if results[0][1]:  # If Groq key exists
        try:
            from groq import Groq
            client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            # Simple test
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": "Say 'OK'"}],
                max_tokens=5
            )
            print("✅ Groq: Connected successfully!")
        except Exception as e:
            print(f"❌ Groq: Connection failed - {str(e)[:50]}")
    
    # Test Cohere
    if results[1][1]:  # If Cohere key exists
        try:
            from cohere import Client
            client = Client(api_key=os.getenv("COHERE_API_KEY"))
            # Simple test
            response = client.chat(
                model="command-r-plus",
                message="Say 'OK'"
            )
            print("✅ Cohere: Connected successfully!")
        except Exception as e:
            print(f"❌ Cohere: Connection failed - {str(e)[:50]}")
    
    # Test Gemini
    if results[2][1]:  # If Gemini key exists
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain_core.messages import HumanMessage
            llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp")
            response = llm.invoke([HumanMessage(content="Say 'OK'")])
            print("✅ Gemini: Connected successfully!")
        except Exception as e:
            print(f"❌ Gemini: Connection failed - {str(e)[:50]}")

def show_recommendations(results):
    """Show setup recommendations based on results."""
    print("\n💡 Recommendations:")
    print("-" * 60)
    
    groq_ok, cohere_ok, gemini_ok = [r[1] for r in results]
    
    if not gemini_ok:
        print("🚨 CRITICAL: Gemini API key is required as fallback!")
        print("   Get it from: https://aistudio.google.com/")
    
    if not groq_ok:
        print("⚠️  Missing Groq: You'll miss out on blazing fast generation!")
        print("   Get free key: https://console.groq.com/")
    
    if not cohere_ok:
        print("⚠️  Missing Cohere: You'll miss superior critique quality!")
        print("   Get free key: https://dashboard.cohere.com/")
    
    if groq_ok and cohere_ok and gemini_ok:
        print("🎉 Perfect! All providers configured!")
        print("   You have the full Avengers team ready!")
        print("\n🚀 Next step: Run 'python polyglot_ai.py' to test!")

if __name__ == "__main__":
    results = check_api_keys()
    
    # Only test connections if at least one provider is available
    if any(r[1] for r in results):
        try:
            test_providers(results)
        except Exception as e:
            print(f"\n⚠️  Connection tests skipped: {e}")
    
    show_recommendations(results)
    
    print("\n" + "=" * 60)
