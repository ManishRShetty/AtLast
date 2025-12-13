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
1.  **Hallucination:** By implementing an "Adversary" node that fact-checks the content before it reaches the user.
2.  **Latency:** By utilizing a Redis-backed prefetching architecture to decouple generation time from user interaction time.

---

## 🏗️ System Architecture

The core of the system is a **Stateful Graph** (built with LangGraph) that mimics a writer's room.

```mermaid
graph TD
    A[Start Session] --> B[Redis Buffer Check]
    B -- Hit --> C[Serve Cached Question]
    B -- Miss --> D[Trigger Background Generation]
    
    subgraph "The Reasoning Loop (Python/FastAPI)"
    D --> E[Generator Node]
    E -->|Draft Riddle| F[Adversary Node]
    F -- "Ambiguous/False" --> E
    F -- "Approved" --> G[Push to Redis]
    end
