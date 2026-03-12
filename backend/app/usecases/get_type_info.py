from app.domain.contracts import TypeRepository
from app.domain.entities import TypeRelations


class GetTypeInfoUseCase:
    def __init__(self, repository: TypeRepository):
        self._repository = repository

    async def get_relations(self, type_name: str) -> TypeRelations:
        return await self._repository.get_type_relations(type_name)

    async def list_all_types(self) -> list[str]:
        return await self._repository.get_all_types()
