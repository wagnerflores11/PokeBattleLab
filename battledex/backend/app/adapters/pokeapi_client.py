import httpx

from app.api.exceptions import PokeAPIError, PokemonNotFoundError
from app.config import settings


class PokeAPIClient:
    def __init__(self):
        self.base_url = settings.pokeapi_base_url
        self._client = httpx.AsyncClient(base_url=self.base_url, timeout=10.0)

    async def get_pokemon(self, identifier: str | int) -> dict:
        try:
            response = await self._client.get(f"/pokemon/{identifier}")
        except httpx.HTTPError as e:
            raise PokeAPIError(f"Failed to fetch pokemon: {e}")
        if response.status_code == 404:
            raise PokemonNotFoundError(str(identifier))
        if response.status_code != 200:
            raise PokeAPIError(f"PokeAPI returned status {response.status_code}")
        return response.json()

    async def get_type(self, type_name: str) -> dict:
        try:
            response = await self._client.get(f"/type/{type_name}")
        except httpx.HTTPError as e:
            raise PokeAPIError(f"Failed to fetch type: {e}")
        if response.status_code == 404:
            raise PokeAPIError(f"Type '{type_name}' not found")
        if response.status_code != 200:
            raise PokeAPIError(f"PokeAPI returned status {response.status_code}")
        return response.json()

    async def list_pokemon(self, limit: int = 100, offset: int = 0) -> dict:
        try:
            response = await self._client.get(
                "/pokemon", params={"limit": limit, "offset": offset}
            )
        except httpx.HTTPError as e:
            raise PokeAPIError(f"Failed to list pokemon: {e}")
        if response.status_code != 200:
            raise PokeAPIError(f"PokeAPI returned status {response.status_code}")
        return response.json()

    async def list_types(self) -> dict:
        try:
            response = await self._client.get("/type")
        except httpx.HTTPError as e:
            raise PokeAPIError(f"Failed to list types: {e}")
        if response.status_code != 200:
            raise PokeAPIError(f"PokeAPI returned status {response.status_code}")
        return response.json()

    async def close(self):
        await self._client.aclose()
