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
            flex: 1, padding: "12px 16px", borderRadius: 12,
            border: "1px solid #45475a", background: "#313244",
            color: "#cdd6f4", fontSize: 16, outline: "none",
          }}
        />
        <button onClick={handleSearch} style={{
          padding: "12px 24px", borderRadius: 12, border: "none",
          background: "#f38ba8", color: "#1e1e2e", fontWeight: 700,
          cursor: "pointer", fontSize: 16,
        }}>
          Find Counters
        </button>
      </div>
      {loading && <p style={{ textAlign: "center", color: "#a6adc8" }}>Analyzing matchups... this may take a moment.</p>}
      {error && <p style={{ textAlign: "center", color: "#f38ba8" }}>{error}</p>}
      {result && (
        <>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ color: "#a6adc8", marginBottom: 12 }}>Best counters for:</p>
            <div style={{ display: "inline-block" }}>
              <PokemonCard pokemon={result.target} compact />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220, 1fr))", gap: 16 }}>
            {result.counters.map((c, i) => (
              <div key={c.id}>
                <PokemonCard pokemon={c} compact />
                <p style={{ fontSize: 12, color: "#a6adc8", marginTop: 8, textAlign: "center" }}>
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
