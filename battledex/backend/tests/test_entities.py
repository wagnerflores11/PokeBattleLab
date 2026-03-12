from app.domain.entities import Pokemon, PokemonStat, PokemonType


def test_pokemon_creation():
    pokemon = Pokemon(
        id=25,
        name="pikachu",
        types=[PokemonType(name="electric")],
        stats=[PokemonStat(name="hp", base_value=35)],
        height=4,
        weight=60,
        sprite_url="https://example.com/pikachu.png",
    )
    assert pokemon.id == 25
    assert pokemon.name == "pikachu"
    assert len(pokemon.types) == 1
    assert pokemon.types[0].name == "electric"


def test_pokemon_multiple_types():
    pokemon = Pokemon(
        id=6,
        name="charizard",
        types=[PokemonType(name="fire"), PokemonType(name="flying")],
        stats=[
            PokemonStat(name="hp", base_value=78),
            PokemonStat(name="attack", base_value=84),
        ],
        height=17,
        weight=905,
    )
    assert len(pokemon.types) == 2
    assert pokemon.sprite_url is None
