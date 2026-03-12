from app.domain.entities import TypeRelations
from app.domain.type_chart import (
    calculate_combined_multiplier,
    calculate_effectiveness,
)


def _fire_relations() -> TypeRelations:
    return TypeRelations(
        name="fire",
        double_damage_to=["grass", "ice", "bug", "steel"],
        half_damage_to=["fire", "water", "rock", "dragon"],
        no_damage_to=[],
        double_damage_from=["water", "ground", "rock"],
        half_damage_from=["fire", "grass", "ice", "bug", "steel", "fairy"],
        no_damage_from=[],
    )


def _water_relations() -> TypeRelations:
    return TypeRelations(
        name="water",
        double_damage_to=["fire", "ground", "rock"],
        half_damage_to=["water", "grass", "dragon"],
        no_damage_to=[],
        double_damage_from=["electric", "grass"],
        half_damage_from=["fire", "water", "ice", "steel"],
        no_damage_from=[],
    )


def test_super_effective():
    relations = {"water": _water_relations()}
    results = calculate_effectiveness(["water"], ["fire"], relations)
    assert len(results) == 1
    assert results[0].multiplier == 2.0


def test_not_very_effective():
    relations = {"fire": _fire_relations()}
    results = calculate_effectiveness(["fire"], ["water"], relations)
    assert len(results) == 1
    assert results[0].multiplier == 0.5


def test_neutral():
    relations = {"fire": _fire_relations()}
    results = calculate_effectiveness(["fire"], ["electric"], relations)
    assert len(results) == 1
    assert results[0].multiplier == 1.0


def test_combined_multiplier():
    relations = {"water": _water_relations()}
    # water vs fire+rock (both super effective)
    multiplier = calculate_combined_multiplier(["water"], ["fire", "rock"], relations)
    assert multiplier == 4.0
