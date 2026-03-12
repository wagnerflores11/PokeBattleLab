# BattleDex

A full stack platform for exploring Pokemon, analyzing types, comparing matchups, finding counters, and saving favorites.

## Stack

- **Backend**: Python 3.11+ / FastAPI (clean architecture)
- **Frontend**: React 19 + TypeScript + Vite
- **External API**: [PokeAPI](https://pokeapi.co/)

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── domain/        # Entities and contracts
│   │   ├── usecases/      # Business logic
│   │   ├── adapters/      # PokeAPI client, cache, repositories
│   │   ├── api/           # REST routes
│   │   ├── favorites/     # Local favorites storage
│   │   ├── dependencies.py
│   │   ├── config.py
│   │   └── main.py
│   └── tests/             # Unit and integration tests
├── frontend/
│   └── src/               # React SPA
└── docs/
    └── architecture.md
```

## Getting Started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
API docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Running Tests

```bash
cd backend
pytest -v
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/pokemon/{name_or_id}` | Get Pokemon by name or ID |
| GET | `/api/v1/pokemon?q=` | Search Pokemon |
| GET | `/api/v1/types` | List all types |
| GET | `/api/v1/types/{name}` | Get type relations |
| GET | `/api/v1/compare?pokemon_a=&pokemon_b=` | Compare two Pokemon |
| GET | `/api/v1/counters/{name}` | Get counter recommendations |
| GET | `/api/v1/favorites` | List favorites |
| POST | `/api/v1/favorites` | Add favorite |
| DELETE | `/api/v1/favorites/{id}` | Remove favorite |

## Features

- **Explore**: Search and view Pokemon details (stats, types, sprites)
- **Type Analysis**: View type strengths, weaknesses, and immunities
- **Compare**: Side-by-side comparison of two Pokemon with type matchup analysis
- **Counter Finder**: Get recommendations for the best Pokemon to counter a target
- **Favorites**: Save and manage your favorite Pokemon locally
- **Caching**: In-memory cache (5 min TTL) to reduce PokeAPI calls
