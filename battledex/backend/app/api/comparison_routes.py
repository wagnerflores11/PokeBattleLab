from fastapi import APIRouter, Query

from app.adapters.pokeapi_client import PokeAPIClient
from app.adapters.pokemon_repository import PokeAPIPokemonRepository
from app.adapters.type_repository import PokeAPITypeRepository
from app.domain.entities import PokemonComparison
from app.usecases.compare_pokemon import ComparePokemonUseCase

router = APIRouter()

client = PokeAPIClient()
pokemon_repo = PokeAPIPokemonRepository(client)
type_repo = PokeAPITypeRepository(client)


@router.get("/compare", response_model=PokemonComparison)
async def compare_pokemon(
    pokemon_a: str = Query(..., description="First pokemon name"),
    pokemon_b: str = Query(..., description="Second pokemon name"),
):
    use_case = ComparePokemonUseCase(pokemon_repo, type_repo)
    return await use_case.execute(pokemon_a, pokemon_b)
