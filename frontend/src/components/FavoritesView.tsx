import { useEffect, useState } from "react";
import { getFavorites, removeFavorite, getPokemon } from "../services/api";
import type { Pokemon, FavoriteEntry } from "../types/pokemon";
import PokemonCard from "./PokemonCard";

export default function FavoritesView() {
  const [favorites, setFavorites] = useState<(FavoriteEntry & { pokemon?: Pokemon })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favs = await getFavorites();
      const withDetails = await Promise.all(
        favs.map(async (f) => {
          try {
            const pokemon = await getPokemon(String(f.pokemon_id));
            return { ...f, pokemon };
          } catch {
            return f;
          }
        })
      );
      setFavorites(withDetails);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadFavorites(); }, []);

  const handleRemove = async (pokemonId: number) => {
    await removeFavorite(pokemonId);
    setFavorites((prev) => prev.filter((f) => f.pokemon_id !== pokemonId));
  };

  if (loading) return <p style={{ textAlign: "center", color: "#aaa" }}>Loading favorites...</p>;

  if (favorites.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#666", padding: 60 }}>
        <p style={{ fontSize: 56, marginBottom: 16 }}>&#9825;</p>
        <p style={{ fontSize: 16 }}>No favorites yet.</p>
        <p style={{ color: "#888", marginTop: 8 }}>Search for a Pokemon and click the heart to add it.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {favorites.map((f) =>
        f.pokemon ? (
          <PokemonCard
            key={f.pokemon_id}
            pokemon={f.pokemon}
            onFavorite={() => handleRemove(f.pokemon_id)}
            isFavorite
          />
        ) : (
          <div key={f.pokemon_id} style={{
            background: "#16213e", borderRadius: 16, padding: 24,
            color: "#eee", textAlign: "center", border: "1px solid #333",
          }}>
            <p style={{ textTransform: "capitalize" }}>{f.pokemon_name}</p>
            <button onClick={() => handleRemove(f.pokemon_id)} style={{
              marginTop: 8, background: "#ef4444", border: "none",
              padding: "8px 18px", borderRadius: 8, cursor: "pointer",
              color: "#fff", fontWeight: 600,
            }}>
              Remove
            </button>
          </div>
        )
      )}
    </div>
  );
}
