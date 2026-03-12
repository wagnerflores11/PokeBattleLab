from fastapi import APIRouter

from app.api.comparison_routes import router as comparison_router
from app.api.pokemon_routes import router as pokemon_router

router = APIRouter(prefix="/api/v1")
router.include_router(pokemon_router, tags=["pokemon"])
router.include_router(comparison_router, tags=["comparison"])
