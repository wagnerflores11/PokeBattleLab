import { useState } from "react";
import { comparePokemon } from "../services/api";
import type { PokemonComparison } from "../types/pokemon";
import PokemonCard from "./PokemonCard";

const inputStyle = {
  flex: 1, minWidth: 140, padding: "14px 18px", borderRadius: 12,
  border: "2px solid #333", background: "#16213e",
  color: "#eee", fontSize: 16, outline: "none",
};

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
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input value={nameA} onChange={(e) => setNameA(e.target.value)} placeholder="First pokemon..." style={inputStyle} />
        <span style={{ color: "#fbbf24", fontWeight: 800, fontSize: 18 }}>VS</span>
        <input value={nameB} onChange={(e) => setNameB(e.target.value)} placeholder="Second pokemon..." style={inputStyle} />
        <button onClick={handleCompare} style={{
          padding: "14px 28px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 16,
          boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
        }}>
          Compare
        </button>
      </div>
      {loading && <p style={{ textAlign: "center", color: "#aaa" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "#ef4444" }}>{error}</p>}
      {result && (
        <>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            <PokemonCard pokemon={result.pokemon_a} compact />
            <PokemonCard pokemon={result.pokemon_b} compact />
          </div>
          <div style={{ background: "#16213e", borderRadius: 16, padding: 24, border: "1px solid #333" }}>
            <h3 style={{ color: "#fbbf24", marginBottom: 16 }}>Stat Comparison</h3>
            {Object.entries(result.stat_differences).map(([stat, diff]) => (
              <div key={stat} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                <span style={{ width: 70, color: "#aaa", fontSize: 13, fontWeight: 600 }}>
                  {statLabels[stat] || stat}
                </span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    {diff > 0 && (
                      <div style={{
                        width: `${Math.min(Math.abs(diff) / 2, 100)}%`,
                        height: 12, borderRadius: 4,
                        background: "linear-gradient(90deg, #22c55e, #4ade80)",
                        minWidth: 4, boxShadow: "0 0 6px #22c55e55",
                      }} />
                    )}
                  </div>
                  <span style={{
                    color: diff > 0 ? "#22c55e" : diff < 0 ? "#ef4444" : "#888",
                    fontWeight: 700, fontSize: 14, width: 45, textAlign: "center",
                  }}>
                    {diff > 0 ? `+${diff}` : diff}
                  </span>
                  <div style={{ flex: 1 }}>
                    {diff < 0 && (
                      <div style={{
                        width: `${Math.min(Math.abs(diff) / 2, 100)}%`,
                        height: 12, borderRadius: 4,
                        background: "linear-gradient(90deg, #ef4444, #f87171)",
                        minWidth: 4, boxShadow: "0 0 6px #ef444455",
                      }} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <h3 style={{ color: "#fbbf24", marginTop: 24, marginBottom: 12 }}>Type Matchups</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {result.type_advantages.map((ta, i) => (
                <span key={i} style={{
                  padding: "5px 14px", borderRadius: 8, fontSize: 13,
                  background: ta.multiplier >= 2 ? "#22c55e" : ta.multiplier <= 0.5 ? "#ef4444" : "#333",
                  color: "#fff", fontWeight: 600,
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
