# BattleDex

A full stack platform for exploring Pokemons, analyzing types, comparing matchups, finding counters, and saving favorites.

## Stack

- **Backend**: Python + FastAPI (clean architecture)
- **Frontend**: React + TypeScript + Vite
- **External API**: [PokeAPI](https://pokeapi.co/)

## Project Structure

```
battledex/
├── backend/       # FastAPI application
├── frontend/      # React + TypeScript SPA
└── docs/          # Architecture and documentation
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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Features

- Explore Pokemon by name or ID
- Analyze type strengths and weaknesses
- Compare two Pokemon side by side
- Get counter recommendations for any Pokemon
- Save your favorite Pokemon locally
