from pydantic import BaseModel


class PokemonType(BaseModel):
    name: str
    url: str | None = None


class PokemonStat(BaseModel):
    name: str
    base_value: int


class Pokemon(BaseModel):
    id: int
    name: str
    types: list[PokemonType]
    stats: list[PokemonStat]
    height: int
    weight: int
    sprite_url: str | None = None


class TypeEffectiveness(BaseModel):
    attacking_type: str
    defending_type: str
    multiplier: float  # 0, 0.5, 1, 2


class TypeRelations(BaseModel):
    name: str
    double_damage_to: list[str]
    half_damage_to: list[str]
    no_damage_to: list[str]
    double_damage_from: list[str]
    half_damage_from: list[str]
    no_damage_from: list[str]


class PokemonComparison(BaseModel):
    pokemon_a: Pokemon
    pokemon_b: Pokemon
    type_advantages: list[TypeEffectiveness]
    stat_differences: dict[str, int]


class CounterRecommendation(BaseModel):
    target: Pokemon
    counters: list[Pokemon]
    reasoning: list[str]
