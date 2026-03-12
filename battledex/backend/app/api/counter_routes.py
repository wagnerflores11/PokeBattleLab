from fastapi import APIRouter, Query

from app.adapters.pokeapi_client import PokeAPIClient
from app.adapters.pokemon_repository import PokeAPIPokemonRepository
from app.adapters.type_repository import PokeAPITypeRepository
from app.domain.entities import CounterRecommendation
from app.usecases.recommend_counters import RecommendCountersUseCase

router = APIRouter()

client = PokeAPIClient()
pokemon_repo = PokeAPIPokemonRepository(client)
type_repo = PokeAPITypeRepository(client)


@router.get("/counters/{pokemon_name}", response_model=CounterRecommendation)
async def get_counters(
    pokemon_name: str,
    limit: int = Query(5, ge=1, le=10, description="Number of counters to return"),
):
    use_case = RecommendCountersUseCase(pokemon_repo, type_repo)
    return await use_case.execute(pokemon_name, max_counters=limit)
