import tempfile
from pathlib import Path

from app.favorites.store import FavoriteEntry, FavoritesStore


def _make_store() -> FavoritesStore:
    tmp = tempfile.mktemp(suffix=".json")
    return FavoritesStore(path=Path(tmp))


def test_add_and_list():
    store = _make_store()
    entry = FavoriteEntry(pokemon_id=25, pokemon_name="pikachu", added_at="2025-01-01T00:00:00Z")
    store.add(entry)
    favorites = store.get_all()
    assert len(favorites) == 1
    assert favorites[0].pokemon_name == "pikachu"


def test_no_duplicates():
    store = _make_store()
    entry = FavoriteEntry(pokemon_id=25, pokemon_name="pikachu", added_at="2025-01-01T00:00:00Z")
    store.add(entry)
    store.add(entry)
    assert len(store.get_all()) == 1


def test_remove():
    store = _make_store()
    entry = FavoriteEntry(pokemon_id=25, pokemon_name="pikachu", added_at="2025-01-01T00:00:00Z")
    store.add(entry)
    assert store.remove(25) is True
    assert len(store.get_all()) == 0


def test_remove_nonexistent():
    store = _make_store()
    assert store.remove(999) is False


def test_is_favorite():
    store = _make_store()
    entry = FavoriteEntry(pokemon_id=25, pokemon_name="pikachu", added_at="2025-01-01T00:00:00Z")
    store.add(entry)
    assert store.is_favorite(25) is True
    assert store.is_favorite(1) is False
