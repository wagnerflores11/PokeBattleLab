from app.domain.contracts import TypeRepository
from app.domain.entities import TypeEffectiveness, TypeRelations
from app.domain.type_chart import calculate_effectiveness


class AnalyzeTypeAdvantageUseCase:
    def __init__(self, type_repository: TypeRepository):
        self._type_repo = type_repository

    async def execute(
        self, attacker_types: list[str], defender_types: list[str]
    ) -> list[TypeEffectiveness]:
        all_types = set(attacker_types + defender_types)
        type_relations: dict[str, TypeRelations] = {}
        for type_name in all_types:
            type_relations[type_name] = await self._type_repo.get_type_relations(type_name)
        return calculate_effectiveness(attacker_types, defender_types, type_relations)
