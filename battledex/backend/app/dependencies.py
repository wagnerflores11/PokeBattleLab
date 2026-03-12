from app.adapters.cache import InMemoryCache
from app.adapters.cached_pokemon_repository import CachedPokemonRepository
from app.adapters.cached_type_repository import CachedTypeRepository
from app.adapters.pokeapi_client import PokeAPIClient
from app.domain.contracts import PokemonRepository, TypeRepository

_client = PokeAPIClient()
_cache = InMemoryCache(ttl_seconds=300)

_pokemon_repo = CachedPokemonRepository(_client, _cache)
_type_repo = CachedTypeRepository(_client, _cache)


def get_pokemon_repo() -> PokemonRepository:
    return _pokemon_repo


def get_type_repo() -> TypeRepository:
    return _type_repo


def get_cache() -> InMemoryCache:
    return _cache
