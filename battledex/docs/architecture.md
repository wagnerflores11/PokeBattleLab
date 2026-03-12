# Architecture

## Overview

BattleDex is a full stack monorepo with a clear separation between backend and frontend.

## Backend (FastAPI + Clean Architecture)

The backend follows clean architecture principles with the following layers:

```
app/
├── domain/         # Entities and contracts (interfaces)
├── usecases/       # Application business logic
├── adapters/       # External integrations (PokeAPI client, cache)
├── api/            # HTTP routes and request/response schemas
├── favorites/      # Local favorites module (JSON file storage)
├── dependencies.py # Centralized dependency wiring
├── config.py       # Application settings
└── main.py         # FastAPI entrypoint with app factory
```

### Layer Rules

- **domain/** — Pure Python. No framework imports. Defines entities (Pokemon, PokemonType, PokemonStat, TypeRelations, TypeEffectiveness, PokemonComparison, CounterRecommendation) and repository contracts (PokemonRepository, TypeRepository).
- **usecases/** — Orchestrates domain logic. Depends only on domain contracts, never on concrete adapters. Includes: GetPokemon, SearchPokemon, GetTypeInfo, AnalyzeTypeAdvantage, ComparePokemon, RecommendCounters.
- **adapters/** — Implements domain contracts. Contains the PokeAPI HTTP client, JSON-to-entity mappers, cached repository decorators, and in-memory TTL cache.
- **api/** — FastAPI routes. Thin layer that receives HTTP requests, calls use cases, and returns responses. Includes custom exception handlers.
- **favorites/** — Self-contained module for local JSON file-based favorites storage.

### Data Flow

```
HTTP Request → api/ → usecases/ → adapters/ → cache hit? → return
                                             → cache miss → PokeAPI
                                ← domain entities ←
HTTP Response ← api/ ← usecases/
```

### Dependency Management

All repositories and clients are instantiated once in `dependencies.py` and shared across routes. This ensures:
- Single PokeAPI HTTP client instance
- Shared cache across all repositories
- Easy swapping of implementations for testing

### Caching Strategy

- In-memory TTL cache (default: 5 minutes)
- Cache keys: `pokemon:name:{name}`, `pokemon:id:{id}`, `type:{name}`, `types:all`
- Cross-population: fetching by name also caches by ID and vice versa
- Search results cached independently

### Error Handling

- `PokemonNotFoundError` → HTTP 404
- `PokeAPIError` → HTTP 502 (upstream failure)
- FastAPI validation → HTTP 422

## Frontend (React + TypeScript + Vite)

The frontend is a single-page application that consumes the backend API.

### Key Decisions

- **Vite** for fast dev server and optimized builds
- **TypeScript** for type safety
- **React 19** for component-based UI

## Integration

- Backend runs on port 8000
- Frontend runs on port 5173 (dev) with Vite proxy to backend `/api` routes
- Frontend communicates with backend via REST API

## External Dependencies

- **PokeAPI** (https://pokeapi.co/) — Source of all Pokemon data. The backend acts as an intermediary, fetching, caching, and transforming data for the frontend.

## Testing

- **Unit tests**: Entities, type chart calculations, cache, mappers, favorites store
- **Integration tests**: API endpoint validation via FastAPI TestClient
- Framework: pytest + pytest-asyncio
