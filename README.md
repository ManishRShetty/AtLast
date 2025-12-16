# 🌍 AtLast: The Infinite, Self-Validating Trivia Engine

> **A Multi-Agent System that plays "Where in the World?"**
>
> *Built to bridge the gap between stochastic LLM research and production-grade reliability.*

![Project Status](https://img.shields.io/badge/Status-Active_Development-green)
![Tech Stack](https://img.shields.io/badge/Stack-FastAPI_|_Next.js_|_LangGraph-blue)
![AI](https://img.shields.io/badge/AI-Agentic_Workflows-purple)

## 📖 Overview

**AtLast** is not just a quiz app; it is an autonomous content generation pipeline. Unlike traditional trivia games with static databases, this system uses a **Hierarchical Agent Graph** to generate, research, and validate geography riddles in real-time.

It solves two critical problems in Generative AI:
1. **Hallucination:** By implementing an "Adversary" node that fact-checks the content before it reaches the user.
2. **Latency:** By utilizing a Redis-backed prefetching architecture to decouple generation time from user interaction time.

---

## 🏗️ System Architecture

The core of the system is a **Stateful Graph** (built with LangGraph) that mimics a writer's room.

### The Workflow

**Node A: The Generator (Creative)**
* Selects a random coordinate or city.
* Drafts a cryptic 3-sentence riddle focusing on history, flora, or architecture.

**Node B: The Adversary (Quality Assurance)**
* **Tool Use:** Searches the web (Tavily API) to verify facts.
* **Logic:** Checks for ambiguity (e.g., "Does this riddle also apply to Paris?").
* **Action:** Rejects the draft and forces a rewrite if quality standards aren't met.

### ⚡ Key Engineering Features

**1. Zero-Latency Experience (Prefetching)**
LLM chains are slow (10s+). To prevent user wait times, the backend utilizes FastAPI `BackgroundTasks` and Redis. When a session starts, the system immediately spins up workers to fill a user-specific queue. Questions are served instantly from the cache.

**2. Hallucination Guardrails**
We treat "Factuality" as a unit test. The Adversary node acts as a semantic filter, ensuring that the model doesn't invent landmarks or confuse similar cities.

**3. Production-Ready Deployment**
* **Backend:** Dockerized FastAPI service hosted on Render.
* **Frontend:** Next.js (TypeScript) edge-deployed on Vercel.
* **Communication:** REST + Server-Sent Events (SSE) for streaming "Reasoning Logs" (real-time logs of the AI's internal debate).

---

## 🛠️ Tech Stack

### Backend (The Brain)
* **Language:** Python 3.10+
* **Framework:** FastAPI
* **Orchestration:** LangGraph, LangChain
* **Models:** GPT-4o / Groq (Llama-3-70b)
* **Tools:** Tavily Search API (for real-time web verification)
* **Database:** Redis (Caching/Queue)

### Frontend (The Face)
* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Mapping:** Mapbox GL JS / React-Map-GL
* **Styling:** Tailwind CSS + Framer Motion
* **State:** React Query

---

## 🚀 Getting Started

### Prerequisites
* Python 3.9+ & Node.js 18+
* Docker (optional, for Redis)
* **API Keys:** `OPENAI_API_KEY` (or Groq), `TAVILY_API_KEY`, `MAPBOX_TOKEN`.

### 1. Clone the Repo

```bash
git clone [https://github.com/yourusername/atlast.git](https://github.com/yourusername/atlast.git)
cd atlast
```
### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Start Redis (using Docker)
docker run -d -p 6379:6379 redis

# Run the API
uvicorn main:app --reload

```
### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
### 4. Environment Variables

### 🤝 Contributing

### 📄 License
