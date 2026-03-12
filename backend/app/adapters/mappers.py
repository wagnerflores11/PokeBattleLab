from app.domain.entities import Pokemon, PokemonStat, PokemonType, TypeRelations


def map_pokemon(data: dict) -> Pokemon:
    types = [
        PokemonType(name=t["type"]["name"], url=t["type"]["url"])
        for t in data["types"]
    ]
    stats = [
        PokemonStat(name=s["stat"]["name"], base_value=s["base_stat"])
        for s in data["stats"]
    ]
    sprites = data.get("sprites", {})
    sprite_url = (
        sprites.get("other", {}).get("official-artwork", {}).get("front_default")
        or sprites.get("front_default")
    )
    return Pokemon(
        id=data["id"],
        name=data["name"],
        types=types,
        stats=stats,
        height=data["height"],
        weight=data["weight"],
        sprite_url=sprite_url,
    )


def map_type_relations(data: dict) -> TypeRelations:
    dr = data["damage_relations"]
    return TypeRelations(
        name=data["name"],
        double_damage_to=[t["name"] for t in dr["double_damage_to"]],
        half_damage_to=[t["name"] for t in dr["half_damage_to"]],
        no_damage_to=[t["name"] for t in dr["no_damage_to"]],
        double_damage_from=[t["name"] for t in dr["double_damage_from"]],
        half_damage_from=[t["name"] for t in dr["half_damage_from"]],
        no_damage_from=[t["name"] for t in dr["no_damage_from"]],
    )
