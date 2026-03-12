from app.domain.contracts import PokemonRepository, TypeRepository
from app.domain.entities import CounterRecommendation, Pokemon, TypeRelations
from app.domain.type_chart import calculate_combined_multiplier

POPULAR_POKEMON = [
    "charizard", "blastoise", "venusaur", "pikachu", "gengar",
    "machamp", "alakazam", "gyarados", "dragonite", "tyranitar",
    "garchomp", "lucario", "metagross", "salamence", "togekiss",
    "excadrill", "ferrothorn", "rotom", "scizor", "gliscor",
]


class RecommendCountersUseCase:
    def __init__(self, pokemon_repo: PokemonRepository, type_repo: TypeRepository):
        self._pokemon_repo = pokemon_repo
        self._type_repo = type_repo

    async def execute(self, target_name: str, max_counters: int = 5) -> CounterRecommendation:
        target = await self._pokemon_repo.get_by_name(target_name)
        target_types = [t.name for t in target.types]

        type_relations: dict[str, TypeRelations] = {}
        for type_name in target_types:
            type_relations[type_name] = await self._type_repo.get_type_relations(type_name)

        candidates: list[tuple[Pokemon, float, str]] = []

        for name in POPULAR_POKEMON:
            if name == target_name.lower():
                continue
            try:
                pokemon = await self._pokemon_repo.get_by_name(name)
            except Exception:
                continue

            pokemon_types = [t.name for t in pokemon.types]

            for pt in pokemon_types:
                if pt not in type_relations:
                    type_relations[pt] = await self._type_repo.get_type_relations(pt)

            offensive_score = calculate_combined_multiplier(
                pokemon_types, target_types, type_relations
            )

            defensive_score = calculate_combined_multiplier(
                target_types, pokemon_types, type_relations
            )

            # High offensive + low defensive from target = good counter
            score = offensive_score / max(defensive_score, 0.25)

            reason = (
                f"{pokemon.name} ({'/'.join(pokemon_types)}) has "
                f"{offensive_score}x offense vs {target.name} and "
                f"takes {defensive_score}x from {target.name}'s types"
            )
            candidates.append((pokemon, score, reason))

        candidates.sort(key=lambda c: c[1], reverse=True)
        top = candidates[:max_counters]

        return CounterRecommendation(
            target=target,
            counters=[c[0] for c in top],
            reasoning=[c[2] for c in top],
        )
