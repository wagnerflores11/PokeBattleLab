from app.adapters.cache import InMemoryCache
from app.adapters.mappers import map_type_relations
from app.adapters.pokeapi_client import PokeAPIClient
from app.domain.contracts import TypeRepository
from app.domain.entities import TypeRelations


class CachedTypeRepository(TypeRepository):
    def __init__(self, client: PokeAPIClient, cache: InMemoryCache):
        self._client = client
        self._cache = cache

    async def get_type_relations(self, type_name: str) -> TypeRelations:
        key = f"type:{type_name.lower()}"
        cached = self._cache.get(key)
        if cached is not None:
            return cached
        data = await self._client.get_type(type_name.lower())
        relations = map_type_relations(data)
        self._cache.set(key, relations)
        return relations

    async def get_all_types(self) -> list[str]:
        key = "types:all"
        cached = self._cache.get(key)
        if cached is not None:
            return cached
        data = await self._client.list_types()
        types = [t["name"] for t in data["results"]]
        self._cache.set(key, types)
        return types
