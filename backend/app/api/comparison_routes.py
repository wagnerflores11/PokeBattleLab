from fastapi import APIRouter, Query

from app.dependencies import get_pokemon_repo, get_type_repo
from app.domain.entities import PokemonComparison
from app.usecases.compare_pokemon import ComparePokemonUseCase

router = APIRouter()


@router.get("/compare", response_model=PokemonComparison)
async def compare_pokemon(
    pokemon_a: str = Query(..., description="First pokemon name"),
    pokemon_b: str = Query(..., description="Second pokemon name"),
):
    use_case = ComparePokemonUseCase(get_pokemon_repo(), get_type_repo())
    return await use_case.execute(pokemon_a, pokemon_b)
