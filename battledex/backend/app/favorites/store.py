import json
from pathlib import Path

from pydantic import BaseModel

DATA_DIR = Path(__file__).parent / "data"
FAVORITES_FILE = DATA_DIR / "favorites.json"


class FavoriteEntry(BaseModel):
    pokemon_id: int
    pokemon_name: str
    added_at: str


class FavoritesStore:
    def __init__(self, path: Path = FAVORITES_FILE):
        self._path = path
        self._path.parent.mkdir(parents=True, exist_ok=True)
        if not self._path.exists():
            self._path.write_text("[]")

    def _load(self) -> list[FavoriteEntry]:
        data = json.loads(self._path.read_text())
        return [FavoriteEntry(**item) for item in data]

    def _save(self, entries: list[FavoriteEntry]) -> None:
        self._path.write_text(
            json.dumps([e.model_dump() for e in entries], indent=2)
        )

    def get_all(self) -> list[FavoriteEntry]:
        return self._load()

    def add(self, entry: FavoriteEntry) -> FavoriteEntry:
        entries = self._load()
        if any(e.pokemon_id == entry.pokemon_id for e in entries):
            return entry
        entries.append(entry)
        self._save(entries)
        return entry

    def remove(self, pokemon_id: int) -> bool:
        entries = self._load()
        filtered = [e for e in entries if e.pokemon_id != pokemon_id]
        if len(filtered) == len(entries):
            return False
        self._save(filtered)
        return True

    def is_favorite(self, pokemon_id: int) -> bool:
        entries = self._load()
        return any(e.pokemon_id == pokemon_id for e in entries)
