from app.domain.contracts import PokemonRepository
from app.domain.entities import Pokemon


class GetPokemonUseCase:
    def __init__(self, repository: PokemonRepository):
        self._repository = repository

    async def by_name(self, name: str) -> Pokemon:
        return await self._repository.get_by_name(name)

    async def by_id(self, pokemon_id: int) -> Pokemon:
        return await self._repository.get_by_id(pokemon_id)
