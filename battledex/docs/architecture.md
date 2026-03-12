# Architecture

## Overview

BattleDex is a full stack monorepo with a clear separation between backend and frontend.

## Backend (FastAPI + Clean Architecture)

The backend follows clean architecture principles with the following layers:

```
app/
├── domain/       # Entities and contracts (interfaces)
├── usecases/     # Application business logic
├── adapters/     # External integrations (PokeAPI client)
├── api/          # HTTP routes and request/response schemas
├── config.py     # Application settings
└── main.py       # FastAPI entrypoint
```

### Layer Rules

- **domain/** — Pure Python. No framework imports. Defines entities (Pokemon, Type, Matchup) and repository/service contracts (abstract classes).
- **usecases/** — Orchestrates domain logic. Depends only on domain contracts, never on concrete adapters.
- **adapters/** — Implements domain contracts. Contains the PokeAPI HTTP client, mappers, and any caching logic.
- **api/** — FastAPI routes. Thin layer that receives HTTP requests, calls use cases, and returns responses.

### Data Flow

```
HTTP Request → api/ → usecases/ → adapters/ → PokeAPI
                                ← domain entities ←
HTTP Response ← api/ ← usecases/
```

## Frontend (React + TypeScript + Vite)

The frontend is a single-page application that consumes the backend API.

### Key Decisions

- **Vite** for fast dev server and optimized builds
- **TypeScript** for type safety
- **React** for component-based UI

## Integration

- Backend runs on port 8000
- Frontend runs on port 5173 (dev) with proxy to backend
- Frontend communicates with backend via REST API

## External Dependencies

- **PokeAPI** (https://pokeapi.co/) — Source of all Pokemon data. The backend acts as an intermediary, fetching and transforming data for the frontend.
