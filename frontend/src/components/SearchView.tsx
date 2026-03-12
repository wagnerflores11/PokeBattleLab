import { useState } from "react";
import { getPokemon } from "../services/api";
import type { Pokemon } from "../types/pokemon";
import PokemonCard from "./PokemonCard";
import { addFavorite, removeFavorite, checkFavorite } from "../services/api";

export default function SearchView() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setPokemon(null);
    try {
      const result = await getPokemon(query.trim().toLowerCase());
      setPokemon(result);
      const fav = await checkFavorite(result.id);
      setIsFav(fav);
    } catch {
      setError("Pokemon not found");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!pokemon) return;
    if (isFav) {
      await removeFavorite(pokemon.id);
      setIsFav(false);
    } else {
      await addFavorite(pokemon.id, pokemon.name);
      setIsFav(true);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter pokemon name or ID..."
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 12,
            border: "1px solid #45475a", background: "#313244",
            color: "#cdd6f4", fontSize: 16, outline: "none",
          }}
        />
        <button onClick={handleSearch} style={{
          padding: "12px 24px", borderRadius: 12, border: "none",
          background: "#89b4fa", color: "#1e1e2e", fontWeight: 700,
          cursor: "pointer", fontSize: 16,
        }}>
          Search
        </button>
      </div>
      {loading && <p style={{ textAlign: "center", color: "#a6adc8" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "#f38ba8" }}>{error}</p>}
      {pokemon && (
        <div style={{ maxWidth: 340, margin: "0 auto" }}>
          <PokemonCard pokemon={pokemon} onFavorite={toggleFavorite} isFavorite={isFav} />
        </div>
      )}
    </div>
  );
}
