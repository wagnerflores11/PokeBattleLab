from app.adapters.mappers import map_pokemon
from app.adapters.pokeapi_client import PokeAPIClient
from app.domain.contracts import PokemonRepository
from app.domain.entities import Pokemon


class PokeAPIPokemonRepository(PokemonRepository):
    def __init__(self, client: PokeAPIClient):
        self._client = client

    async def get_by_name(self, name: str) -> Pokemon:
        data = await self._client.get_pokemon(name.lower())
        return map_pokemon(data)

    async def get_by_id(self, pokemon_id: int) -> Pokemon:
        data = await self._client.get_pokemon(pokemon_id)
        return map_pokemon(data)

    async def search(self, query: str, limit: int = 20) -> list[Pokemon]:
        listing = await self._client.list_pokemon(limit=1000)
        matches = [
            r for r in listing["results"] if query.lower() in r["name"].lower()
        ][:limit]
        pokemons = []
        for match in matches:
            data = await self._client.get_pokemon(match["name"])
            pokemons.append(map_pokemon(data))
        return pokemons
