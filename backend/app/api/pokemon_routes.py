from fastapi import APIRouter, Query

from app.dependencies import get_pokemon_repo, get_type_repo
from app.domain.entities import Pokemon, TypeRelations
from app.usecases.get_pokemon import GetPokemonUseCase
from app.usecases.get_type_info import GetTypeInfoUseCase
from app.usecases.search_pokemon import SearchPokemonUseCase

router = APIRouter()


@router.get("/pokemon/{identifier}", response_model=Pokemon)
async def get_pokemon(identifier: str):
    use_case = GetPokemonUseCase(get_pokemon_repo())
    if identifier.isdigit():
        return await use_case.by_id(int(identifier))
    return await use_case.by_name(identifier)


@router.get("/pokemon", response_model=list[Pokemon])
async def search_pokemon(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(20, ge=1, le=50),
):
    use_case = SearchPokemonUseCase(get_pokemon_repo())
    return await use_case.execute(q, limit=limit)


@router.get("/types", response_model=list[str])
async def list_types():
    use_case = GetTypeInfoUseCase(get_type_repo())
    return await use_case.list_all_types()


@router.get("/types/{type_name}", response_model=TypeRelations)
async def get_type_relations(type_name: str):
    use_case = GetTypeInfoUseCase(get_type_repo())
    return await use_case.get_relations(type_name)
