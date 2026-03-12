from app.domain.entities import TypeEffectiveness, TypeRelations


def calculate_effectiveness(
    attacker_types: list[str], defender_types: list[str], type_relations: dict[str, TypeRelations]
) -> list[TypeEffectiveness]:
    results = []
    for atk_type in attacker_types:
        relations = type_relations.get(atk_type)
        if not relations:
            continue
        for def_type in defender_types:
            multiplier = _get_multiplier(relations, def_type)
            results.append(
                TypeEffectiveness(
                    attacking_type=atk_type,
                    defending_type=def_type,
                    multiplier=multiplier,
                )
            )
    return results


def calculate_combined_multiplier(
    attacker_types: list[str], defender_types: list[str], type_relations: dict[str, TypeRelations]
) -> float:
    total = 1.0
    for atk_type in attacker_types:
        relations = type_relations.get(atk_type)
        if not relations:
            continue
        for def_type in defender_types:
            total *= _get_multiplier(relations, def_type)
    return total


def _get_multiplier(relations: TypeRelations, defending_type: str) -> float:
    if defending_type in relations.double_damage_to:
        return 2.0
    if defending_type in relations.half_damage_to:
        return 0.5
    if defending_type in relations.no_damage_to:
        return 0.0
    return 1.0
