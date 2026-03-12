import { useEffect, useState } from "react";
import { getAllTypes, getTypeRelations } from "../services/api";
import type { TypeRelations } from "../types/pokemon";

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030",
  grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
  ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
  rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
  steel: "#B8B8D0", fairy: "#EE99AC",
};

function TypeBadge({ name, onClick, active }: { name: string; onClick?: () => void; active?: boolean }) {
  return (
    <span
      onClick={onClick}
      style={{
        background: TYPE_COLORS[name] || "#888",
        padding: "6px 16px", borderRadius: 20, fontSize: 13,
        color: "#fff", fontWeight: 700, textTransform: "capitalize",
        cursor: onClick ? "pointer" : "default",
        display: "inline-block",
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        boxShadow: active ? `0 0 0 3px #fbbf24, 0 4px 12px ${TYPE_COLORS[name]}66` : `0 2px 4px rgba(0,0,0,0.2)`,
        transform: active ? "scale(1.1)" : "scale(1)",
        transition: "all 0.15s",
      }}
    >
      {name}
    </span>
  );
}

export default function TypesView() {
  const [types, setTypes] = useState<string[]>([]);
  const [selected, setSelected] = useState<TypeRelations | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllTypes().then(setTypes);
  }, []);

  const handleSelect = async (name: string) => {
    setLoading(true);
    try {
      const data = await getTypeRelations(name);
      setSelected(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28, justifyContent: "center" }}>
        {types.filter(t => TYPE_COLORS[t]).map((t) => (
          <TypeBadge key={t} name={t} onClick={() => handleSelect(t)} active={selected?.name === t} />
        ))}
      </div>
      {loading && <p style={{ textAlign: "center", color: "#aaa" }}>Loading...</p>}
      {selected && (
        <div style={{ background: "#16213e", borderRadius: 16, padding: 28, border: "1px solid #333" }}>
          <h3 style={{
            color: TYPE_COLORS[selected.name] || "#fff",
            textTransform: "capitalize", textAlign: "center", marginBottom: 24,
            fontSize: 22,
          }}>
            {selected.name} Type
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <h4 style={{ color: "#22c55e", marginBottom: 10 }}>Super effective against (2x)</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.double_damage_to.length ? selected.double_damage_to.map(t => <TypeBadge key={t} name={t} />) : <span style={{ color: "#666" }}>None</span>}
              </div>
            </div>
            <div>
              <h4 style={{ color: "#ef4444", marginBottom: 10 }}>Weak against (2x from)</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.double_damage_from.length ? selected.double_damage_from.map(t => <TypeBadge key={t} name={t} />) : <span style={{ color: "#666" }}>None</span>}
              </div>
            </div>
            <div>
              <h4 style={{ color: "#fbbf24", marginBottom: 10 }}>Not very effective (0.5x)</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.half_damage_to.length ? selected.half_damage_to.map(t => <TypeBadge key={t} name={t} />) : <span style={{ color: "#666" }}>None</span>}
              </div>
            </div>
            <div>
              <h4 style={{ color: "#fbbf24", marginBottom: 10 }}>Resists (0.5x from)</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.half_damage_from.length ? selected.half_damage_from.map(t => <TypeBadge key={t} name={t} />) : <span style={{ color: "#666" }}>None</span>}
              </div>
            </div>
            {(selected.no_damage_to.length > 0 || selected.no_damage_from.length > 0) && (
              <>
                <div>
                  <h4 style={{ color: "#888", marginBottom: 10 }}>No effect on (0x)</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selected.no_damage_to.length ? selected.no_damage_to.map(t => <TypeBadge key={t} name={t} />) : <span style={{ color: "#666" }}>None</span>}
                  </div>
                </div>
                <div>
                  <h4 style={{ color: "#888", marginBottom: 10 }}>Immune to (0x from)</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selected.no_damage_from.length ? selected.no_damage_from.map(t => <TypeBadge key={t} name={t} />) : <span style={{ color: "#666" }}>None</span>}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
