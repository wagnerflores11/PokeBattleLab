import { useState } from "react";
import { comparePokemon } from "../services/api";
import type { PokemonComparison } from "../types/pokemon";
import PokemonCard from "./PokemonCard";

export default function CompareView() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [result, setResult] = useState<PokemonComparison | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!nameA.trim() || !nameB.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await comparePokemon(nameA.trim().toLowerCase(), nameB.trim().toLowerCase());
      setResult(data);
    } catch {
      setError("Could not compare. Check the names.");
    } finally {
      setLoading(false);
    }
  };

  const statLabels: Record<string, string> = {
    hp: "HP", attack: "ATK", defense: "DEF",
    "special-attack": "SP.ATK", "special-defense": "SP.DEF", speed: "SPD",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          value={nameA}
          onChange={(e) => setNameA(e.target.value)}
          placeholder="First pokemon..."
          style={{
            flex: 1, minWidth: 140, padding: "12px 16px", borderRadius: 12,
            border: "1px solid #45475a", background: "#313244",
            color: "#cdd6f4", fontSize: 16, outline: "none",
          }}
        />
        <span style={{ color: "#6c7086", alignSelf: "center", fontWeight: 700 }}>VS</span>
        <input
          value={nameB}
          onChange={(e) => setNameB(e.target.value)}
          placeholder="Second pokemon..."
          style={{
            flex: 1, minWidth: 140, padding: "12px 16px", borderRadius: 12,
            border: "1px solid #45475a", background: "#313244",
            color: "#cdd6f4", fontSize: 16, outline: "none",
          }}
        />
        <button onClick={handleCompare} style={{
          padding: "12px 24px", borderRadius: 12, border: "none",
          background: "#cba6f7", color: "#1e1e2e", fontWeight: 700,
          cursor: "pointer", fontSize: 16,
        }}>
          Compare
        </button>
      </div>
      {loading && <p style={{ textAlign: "center", color: "#a6adc8" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "#f38ba8" }}>{error}</p>}
      {result && (
        <>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            <PokemonCard pokemon={result.pokemon_a} compact />
            <PokemonCard pokemon={result.pokemon_b} compact />
          </div>
          <div style={{ background: "#1e1e2e", borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: "#cdd6f4", marginBottom: 16 }}>Stat Comparison</h3>
            {Object.entries(result.stat_differences).map(([stat, diff]) => (
              <div key={stat} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                <span style={{ width: 70, color: "#a6adc8", fontSize: 13, fontWeight: 600 }}>
                  {statLabels[stat] || stat}
                </span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    {diff > 0 && (
                      <div style={{
                        width: `${Math.min(Math.abs(diff) / 2, 100)}%`,
                        height: 12, borderRadius: 4, background: "#a6e3a1",
                        minWidth: 4,
                      }} />
                    )}
                  </div>
                  <span style={{
                    color: diff > 0 ? "#a6e3a1" : diff < 0 ? "#f38ba8" : "#a6adc8",
                    fontWeight: 700, fontSize: 14, width: 45, textAlign: "center",
                  }}>
                    {diff > 0 ? `+${diff}` : diff}
                  </span>
                  <div style={{ flex: 1 }}>
                    {diff < 0 && (
                      <div style={{
                        width: `${Math.min(Math.abs(diff) / 2, 100)}%`,
                        height: 12, borderRadius: 4, background: "#f38ba8",
                        minWidth: 4,
                      }} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <h3 style={{ color: "#cdd6f4", marginTop: 24, marginBottom: 12 }}>Type Matchups</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {result.type_advantages.map((ta, i) => (
                <span key={i} style={{
                  padding: "4px 12px", borderRadius: 8, fontSize: 13,
                  background: ta.multiplier >= 2 ? "#a6e3a1" : ta.multiplier <= 0.5 ? "#f38ba8" : "#45475a",
                  color: ta.multiplier >= 2 || ta.multiplier <= 0.5 ? "#1e1e2e" : "#cdd6f4",
                  fontWeight: 600,
                }}>
                  {ta.attacking_type} → {ta.defending_type}: {ta.multiplier}x
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
