from app.adapters.cache import InMemoryCache
from app.adapters.mappers import map_pokemon
from app.adapters.pokeapi_client import PokeAPIClient
from app.domain.contracts import PokemonRepository
from app.domain.entities import Pokemon


class CachedPokemonRepository(PokemonRepository):
    def __init__(self, client: PokeAPIClient, cache: InMemoryCache):
        self._client = client
        self._cache = cache

    async def get_by_name(self, name: str) -> Pokemon:
        key = f"pokemon:name:{name.lower()}"
        cached = self._cache.get(key)
        if cached is not None:
            return cached
        data = await self._client.get_pokemon(name.lower())
        pokemon = map_pokemon(data)
        self._cache.set(key, pokemon)
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
