from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.favorites.store import FavoriteEntry, FavoritesStore

router = APIRouter()

store = FavoritesStore()


class AddFavoriteRequest(BaseModel):
    pokemon_id: int
    pokemon_name: str


@router.get("/favorites", response_model=list[FavoriteEntry])
async def list_favorites():
    return store.get_all()


@router.post("/favorites", response_model=FavoriteEntry, status_code=201)
async def add_favorite(request: AddFavoriteRequest):
    entry = FavoriteEntry(
        pokemon_id=request.pokemon_id,
        pokemon_name=request.pokemon_name,
        added_at=datetime.now(timezone.utc).isoformat(),
    )
    return store.add(entry)


@router.delete("/favorites/{pokemon_id}")
async def remove_favorite(pokemon_id: int):
    removed = store.remove(pokemon_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"detail": "Removed from favorites"}


@router.get("/favorites/{pokemon_id}/check")
async def check_favorite(pokemon_id: int):
    return {"is_favorite": store.is_favorite(pokemon_id)}
