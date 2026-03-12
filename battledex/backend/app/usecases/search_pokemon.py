from app.domain.contracts import PokemonRepository
from app.domain.entities import Pokemon


class SearchPokemonUseCase:
    def __init__(self, repository: PokemonRepository):
        self._repository = repository

    async def execute(self, query: str, limit: int = 20) -> list[Pokemon]:
        return await self._repository.search(query, limit=limit)
