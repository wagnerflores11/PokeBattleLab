from fastapi import APIRouter, Query

from app.dependencies import get_pokemon_repo, get_type_repo
from app.domain.entities import CounterRecommendation
from app.usecases.recommend_counters import RecommendCountersUseCase

router = APIRouter()


@router.get("/counters/{pokemon_name}", response_model=CounterRecommendation)
async def get_counters(
    pokemon_name: str,
    limit: int = Query(5, ge=1, le=10, description="Number of counters to return"),
):
    use_case = RecommendCountersUseCase(get_pokemon_repo(), get_type_repo())
    return await use_case.execute(pokemon_name, max_counters=limit)
