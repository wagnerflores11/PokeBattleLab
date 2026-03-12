from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.exceptions import (
    PokeAPIError,
    PokemonNotFoundError,
    pokeapi_error_handler,
    pokemon_not_found_handler,
)
from app.api.router import router


def create_app() -> FastAPI:
    application = FastAPI(
        title="BattleDex API",
        description="Pokemon battle analysis and counter recommendation API",
        version="0.1.0",
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.add_exception_handler(PokemonNotFoundError, pokemon_not_found_handler)
    application.add_exception_handler(PokeAPIError, pokeapi_error_handler)

    application.include_router(router)

    @application.get("/health")
    async def health_check():
        return {"status": "ok", "service": "battledex-api"}

    return application


app = create_app()
