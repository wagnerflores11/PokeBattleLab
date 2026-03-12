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

  if (loading) return <p style={{ textAlign: "center", color: "#a6adc8" }}>Loading favorites...</p>;

  if (favorites.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#6c7086", padding: 40 }}>
        <p style={{ fontSize: 48, marginBottom: 12 }}>&#9825;</p>
        <p>No favorites yet. Search for a Pokemon and click the heart to add it.</p>
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
            background: "#1e1e2e", borderRadius: 16, padding: 24,
            color: "#cdd6f4", textAlign: "center",
          }}>
            <p style={{ textTransform: "capitalize" }}>{f.pokemon_name}</p>
            <button onClick={() => handleRemove(f.pokemon_id)} style={{
              marginTop: 8, background: "#f38ba8", border: "none",
              padding: "6px 16px", borderRadius: 8, cursor: "pointer",
              color: "#1e1e2e", fontWeight: 600,
            }}>
              Remove
            </button>
          </div>
        )
      )}
    </div>
  );
}
