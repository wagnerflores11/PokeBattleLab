from abc import ABC, abstractmethod

from app.domain.entities import Pokemon, TypeRelations


class PokemonRepository(ABC):
    @abstractmethod
    async def get_by_name(self, name: str) -> Pokemon:
        ...

    @abstractmethod
    async def get_by_id(self, pokemon_id: int) -> Pokemon:
        ...

    @abstractmethod
    async def search(self, query: str, limit: int = 20) -> list[Pokemon]:
        ...


class TypeRepository(ABC):
    @abstractmethod
    async def get_type_relations(self, type_name: str) -> TypeRelations:
        ...

    @abstractmethod
    async def get_all_types(self) -> list[str]:
        ...
