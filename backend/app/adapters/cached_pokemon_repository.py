from app.adapters.cache import InMemoryCache
from app.adapters.mappers import map_pokemon
from app.adapters.pokeapi_client import PokeAPIClient
from app.api.exceptions import PokemonNotFoundError
from app.domain.contracts import PokemonRepository
from app.domain.entities import Pokemon
from app.domain.fuzzy import find_closest


class CachedPokemonRepository(PokemonRepository):
    def __init__(self, client: PokeAPIClient, cache: InMemoryCache):
        self._client = client
        self._cache = cache

    async def _get_all_names(self) -> list[str]:
        key = "pokemon:all_names"
        cached = self._cache.get(key)
        if cached is not None:
            return cached
        listing = await self._client.list_pokemon(limit=1500)
        names = [r["name"] for r in listing["results"]]
        self._cache.set(key, names)
        return names

    async def get_by_name(self, name: str) -> Pokemon:
        key = f"pokemon:name:{name.lower()}"
        cached = self._cache.get(key)
        if cached is not None:
            return cached
        try:
            data = await self._client.get_pokemon(name.lower())
        except PokemonNotFoundError:
            # Try fuzzy match
            all_names = await self._get_all_names()
            closest = find_closest(name.lower(), all_names)
            if closest is None:
                raise
            data = await self._client.get_pokemon(closest)
        pokemon = map_pokemon(data)
        self._cache.set(key, pokemon)
        self._cache.set(f"pokemon:name:{pokemon.name}", pokemon)
        self._cache.set(f"pokemon:id:{pokemon.id}", pokemon)
        return pokemon

    async def get_by_id(self, pokemon_id: int) -> Pokemon:
        key = f"pokemon:id:{pokemon_id}"
        cached = self._cache.get(key)
        if cached is not None:
            return cached
        data = await self._client.get_pokemon(pokemon_id)
        pokemon = map_pokemon(data)
        self._cache.set(key, pokemon)
        self._cache.set(f"pokemon:name:{pokemon.name}", pokemon)
        return pokemon

    async def search(self, query: str, limit: int = 20) -> list[Pokemon]:
        key = f"pokemon:search:{query.lower()}:{limit}"
        cached = self._cache.get(key)
        if cached is not None:
            return cached
        listing = await self._client.list_pokemon(limit=1000)
        matches = [
            r for r in listing["results"] if query.lower() in r["name"].lower()
        ][:limit]
        pokemons = []
        for match in matches:
            pokemon = await self.get_by_name(match["name"])
            pokemons.append(pokemon)
        self._cache.set(key, pokemons)
        return pokemons
