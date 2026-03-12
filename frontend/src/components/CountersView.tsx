import { useState } from "react";
import { getCounters } from "../services/api";
import type { CounterRecommendation } from "../types/pokemon";
import PokemonCard from "./PokemonCard";

export default function CountersView() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<CounterRecommendation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await getCounters(name.trim().toLowerCase());
      setResult(data);
    } catch {
      setError("Could not find counters. Check the name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter pokemon to counter..."
          style={{
            flex: 1, padding: "14px 18px", borderRadius: 12,
            border: "2px solid #333", background: "#16213e",
            color: "#eee", fontSize: 16, outline: "none",
          }}
        />
        <button onClick={handleSearch} style={{
          padding: "14px 28px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #dc2626, #f97316)",
          color: "#fff", fontWeight: 700,
          cursor: "pointer", fontSize: 16,
          boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
        }}>
          Find Counters
        </button>
      </div>
      {loading && <p style={{ textAlign: "center", color: "#aaa" }}>Analyzing matchups... this may take a moment.</p>}
      {error && <p style={{ textAlign: "center", color: "#ef4444" }}>{error}</p>}
      {result && (
        <>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ color: "#fbbf24", marginBottom: 12, fontWeight: 600 }}>Best counters for:</p>
            <div style={{ display: "inline-block" }}>
              <PokemonCard pokemon={result.target} compact />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {result.counters.map((c, i) => (
              <div key={c.id}>
                <PokemonCard pokemon={c} compact />
                <p style={{ fontSize: 12, color: "#999", marginTop: 8, textAlign: "center" }}>
                  {result.reasoning[i]}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
