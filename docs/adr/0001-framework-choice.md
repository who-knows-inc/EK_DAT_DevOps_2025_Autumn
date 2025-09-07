# ADR-0001: Framework Choice

## Context
For the DevOps course project, we need a lightweight backend framework to expose APIs.  
The framework must:
- Be simple to learn and use as a group
- Integrate with CI/CD pipelines
- Support OpenAPI specification (mandatory in course)
- Allow future scalability (cloud deploy, containers)

## Decision
We choose **FastAPI (Python)** as our backend framework.  
For databases, we use **SQLite** during local development (simple, file-based) and **Postgres** for production deployment (robust, cloud-ready).

## Status
Accepted (Week 2)

## Alternatives considered
- **Pyramid / Bottle**: Lightweight, but less modern ecosystem compared to FastAPI.
- **Phoenix (Elixir)**: Very scalable, but steeper learning curve and limited group familiarity.

## Consequences
- We gain automatic OpenAPI docs and async support (helpful for realtime features).
- SQLite → Postgres migration is straightforward with SQLAlchemy.
- The group can reuse existing Python knowledge.
- We must manage Python dependencies and containerization carefully.
