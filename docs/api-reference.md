# API Reference

Base URL: `http://localhost:8000`

## Health

### GET /health

Returns service status.

**Response:**
```json
{"status": "ok", "service": "battledex-api"}
```

## Pokemon

### GET /api/v1/pokemon/{identifier}

Get a Pokemon by name or ID.

**Parameters:**
- `identifier` (path) — Pokemon name (e.g., `pikachu`) or ID (e.g., `25`)

**Response:** Pokemon object with id, name, types, stats, height, weight, sprite_url.

### GET /api/v1/pokemon?q={query}&limit={limit}

Search Pokemon by name substring.

**Parameters:**
- `q` (query, required) — Search string (min 1 char)
- `limit` (query, optional) — Max results, 1-50, default 20

**Response:** Array of Pokemon objects.

## Types

### GET /api/v1/types

List all Pokemon types.

**Response:** Array of type name strings.

### GET /api/v1/types/{type_name}

Get type damage relations.

**Response:** TypeRelations object with double_damage_to, half_damage_to, no_damage_to, double_damage_from, half_damage_from, no_damage_from.

## Comparison

### GET /api/v1/compare?pokemon_a={name}&pokemon_b={name}

Compare two Pokemon side by side.

**Parameters:**
- `pokemon_a` (query, required) — First Pokemon name
- `pokemon_b` (query, required) — Second Pokemon name

**Response:** PokemonComparison with both Pokemon data, type advantages, and stat differences.

## Counters

### GET /api/v1/counters/{pokemon_name}?limit={limit}

Get counter recommendations for a Pokemon.

**Parameters:**
- `pokemon_name` (path) — Target Pokemon name
- `limit` (query, optional) — Number of counters, 1-10, default 5

**Response:** CounterRecommendation with target Pokemon, list of counter Pokemon, and reasoning.

## Favorites

### GET /api/v1/favorites

List all saved favorites.

### POST /api/v1/favorites

Add a Pokemon to favorites.

**Body:**
```json
{"pokemon_id": 25, "pokemon_name": "pikachu"}
```

### DELETE /api/v1/favorites/{pokemon_id}

Remove a Pokemon from favorites.

### GET /api/v1/favorites/{pokemon_id}/check

Check if a Pokemon is a favorite.

**Response:**
```json
{"is_favorite": true}
```
