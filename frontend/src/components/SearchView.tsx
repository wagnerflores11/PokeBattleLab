import { useEffect, useState } from "react";
import { getPokemon, addFavorite, removeFavorite, checkFavorite } from "../services/api";
import type { Pokemon } from "../types/pokemon";
import PokemonCard from "./PokemonCard";

const INITIAL_POKEMON = [1, 4, 7, 25, 6, 9, 150, 133, 143, 94, 130, 149];

export default function SearchView() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadInitial = async () => {
      const results: Pokemon[] = [];
      for (const id of INITIAL_POKEMON) {
        try {
          const p = await getPokemon(String(id));
          results.push(p);
        } catch { /* skip */ }
      }
      setPokemonList(results);
      setInitialLoading(false);
    };
    loadInitial();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSelected(null);
    try {
      const result = await getPokemon(query.trim().toLowerCase());
      setSelected(result);
      const fav = await checkFavorite(result.id);
      setIsFav(fav);
    } catch {
      setError("Pokemon not found");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (pokemon: Pokemon) => {
    setSelected(pokemon);
    setQuery(pokemon.name);
    const fav = await checkFavorite(pokemon.id);
    setIsFav(fav);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = async () => {
    if (!selected) return;
    if (isFav) {
      await removeFavorite(selected.id);
      setIsFav(false);
    } else {
      await addFavorite(selected.id, selected.name);
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
          placeholder="Search pokemon by name or ID..."
          style={{
            flex: 1, padding: "14px 18px", borderRadius: 12,
            border: "2px solid #333", background: "#16213e",
            color: "#eee", fontSize: 16, outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#dc2626"}
          onBlur={(e) => e.target.style.borderColor = "#333"}
        />
        <button onClick={handleSearch} style={{
          padding: "14px 28px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #dc2626, #ef4444)",
          color: "#fff", fontWeight: 700,
          cursor: "pointer", fontSize: 16,
          boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
        }}>
          Search
        </button>
      </div>

      {loading && <p style={{ textAlign: "center", color: "#aaa" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "#ef4444" }}>{error}</p>}

      {selected && (
        <div style={{ maxWidth: 340, margin: "0 auto 32px" }}>
          <PokemonCard pokemon={selected} onFavorite={toggleFavorite} isFavorite={isFav} />
          <button
            onClick={() => setSelected(null)}
            style={{
              display: "block", margin: "12px auto 0", padding: "8px 20px",
              background: "transparent", border: "1px solid #555",
              color: "#aaa", borderRadius: 8, cursor: "pointer", fontSize: 13,
            }}
          >
            Back to list
          </button>
        </div>
      )}

      {!selected && (
        <>
          {initialLoading ? (
            <p style={{ textAlign: "center", color: "#aaa" }}>Loading Pokemon...</p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}>
              {pokemonList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleCardClick(p)}
                  style={{ cursor: "pointer" }}
                >
                  <PokemonCard pokemon={p} compact />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
