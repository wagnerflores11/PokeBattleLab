from fastapi import Request
from fastapi.responses import JSONResponse


class PokemonNotFoundError(Exception):
    def __init__(self, identifier: str):
        self.identifier = identifier
        self.message = f"Pokemon '{identifier}' not found"
        super().__init__(self.message)


class PokeAPIError(Exception):
    def __init__(self, message: str = "Failed to fetch data from PokeAPI"):
        self.message = message
        super().__init__(self.message)


async def pokemon_not_found_handler(request: Request, exc: PokemonNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"detail": exc.message, "status_code": 404},
    )


async def pokeapi_error_handler(request: Request, exc: PokeAPIError):
    return JSONResponse(
        status_code=502,
        content={"detail": exc.message, "status_code": 502},
    )
