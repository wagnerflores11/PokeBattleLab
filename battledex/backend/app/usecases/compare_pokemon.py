from app.domain.contracts import PokemonRepository, TypeRepository
from app.domain.entities import PokemonComparison, TypeRelations
from app.domain.type_chart import calculate_effectiveness


class ComparePokemonUseCase:
    def __init__(self, pokemon_repo: PokemonRepository, type_repo: TypeRepository):
        self._pokemon_repo = pokemon_repo
        self._type_repo = type_repo

    async def execute(self, name_a: str, name_b: str) -> PokemonComparison:
        pokemon_a = await self._pokemon_repo.get_by_name(name_a)
        pokemon_b = await self._pokemon_repo.get_by_name(name_b)

        types_a = [t.name for t in pokemon_a.types]
        types_b = [t.name for t in pokemon_b.types]

        all_types = set(types_a + types_b)
        type_relations: dict[str, TypeRelations] = {}
        for type_name in all_types:
            type_relations[type_name] = await self._type_repo.get_type_relations(type_name)

        advantages_a_vs_b = calculate_effectiveness(types_a, types_b, type_relations)
        advantages_b_vs_a = calculate_effectiveness(types_b, types_a, type_relations)
        type_advantages = advantages_a_vs_b + advantages_b_vs_a

        stats_a = {s.name: s.base_value for s in pokemon_a.stats}
        stats_b = {s.name: s.base_value for s in pokemon_b.stats}
        stat_differences = {
            name: stats_a.get(name, 0) - stats_b.get(name, 0)
            for name in stats_a
        }

        return PokemonComparison(
            pokemon_a=pokemon_a,
            pokemon_b=pokemon_b,
            type_advantages=type_advantages,
            stat_differences=stat_differences,
        )
