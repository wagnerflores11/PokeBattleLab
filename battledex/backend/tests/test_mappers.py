from app.adapters.mappers import map_pokemon, map_type_relations


def test_map_pokemon():
    raw = {
        "id": 25,
        "name": "pikachu",
        "height": 4,
        "weight": 60,
        "types": [{"type": {"name": "electric", "url": "https://pokeapi.co/api/v2/type/13/"}}],
        "stats": [
            {"stat": {"name": "hp"}, "base_stat": 35},
            {"stat": {"name": "attack"}, "base_stat": 55},
        ],
        "sprites": {
            "front_default": "https://example.com/pikachu.png",
            "other": {
                "official-artwork": {
                    "front_default": "https://example.com/pikachu-art.png"
                }
            },
        },
    }
    pokemon = map_pokemon(raw)
    assert pokemon.id == 25
    assert pokemon.name == "pikachu"
    assert pokemon.types[0].name == "electric"
    assert pokemon.stats[0].base_value == 35
    assert pokemon.sprite_url == "https://example.com/pikachu-art.png"


def test_map_pokemon_fallback_sprite():
    raw = {
        "id": 1,
        "name": "bulbasaur",
        "height": 7,
        "weight": 69,
        "types": [{"type": {"name": "grass", "url": ""}}],
        "stats": [{"stat": {"name": "hp"}, "base_stat": 45}],
        "sprites": {"front_default": "https://example.com/bulb.png"},
    }
    pokemon = map_pokemon(raw)
    assert pokemon.sprite_url == "https://example.com/bulb.png"


def test_map_type_relations():
    raw = {
        "name": "fire",
        "damage_relations": {
            "double_damage_to": [{"name": "grass"}],
            "half_damage_to": [{"name": "water"}],
            "no_damage_to": [],
            "double_damage_from": [{"name": "water"}],
            "half_damage_from": [{"name": "grass"}],
            "no_damage_from": [],
        },
    }
    relations = map_type_relations(raw)
    assert relations.name == "fire"
    assert "grass" in relations.double_damage_to
    assert "water" in relations.half_damage_to
