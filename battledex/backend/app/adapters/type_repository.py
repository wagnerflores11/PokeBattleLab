from app.adapters.mappers import map_type_relations
from app.adapters.pokeapi_client import PokeAPIClient
from app.domain.contracts import TypeRepository
from app.domain.entities import TypeRelations


class PokeAPITypeRepository(TypeRepository):
    def __init__(self, client: PokeAPIClient):
        self._client = client

    async def get_type_relations(self, type_name: str) -> TypeRelations:
        data = await self._client.get_type(type_name.lower())
        return map_type_relations(data)

    async def get_all_types(self) -> list[str]:
        data = await self._client.list_types()
        return [t["name"] for t in data["results"]]
