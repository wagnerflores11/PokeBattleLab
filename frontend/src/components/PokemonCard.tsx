import type { Pokemon } from "../types/pokemon";

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030",
  grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
  ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
  rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
  steel: "#B8B8D0", fairy: "#EE99AC",
};

const TYPE_BG: Record<string, string> = {
  normal: "#2a2a24", fire: "#2e1a10", water: "#1a2040", electric: "#2e2a10",
  grass: "#1a2e1a", ice: "#1a2e2e", fighting: "#2e1010", poison: "#2a1a2a",
  ground: "#2e2a1a", flying: "#2220330", psychic: "#2e1a24", bug: "#242a10",
  rock: "#2a2410", ghost: "#1e1a28", dragon: "#1a10300", dark: "#1e1a14",
  steel: "#242430", fairy: "#2e1a24",
};

interface Props {
  pokemon: Pokemon;
  onFavorite?: () => void;
  isFavorite?: boolean;
  compact?: boolean;
}

export default function PokemonCard({ pokemon, onFavorite, isFavorite, compact }: Props) {
  const statLabels: Record<string, string> = {
    hp: "HP", attack: "ATK", defense: "DEF",
    "special-attack": "SP.ATK", "special-defense": "SP.DEF", speed: "SPD",
  };

  const mainType = pokemon.types[0]?.name || "normal";
  const typeColor = TYPE_COLORS[mainType] || "#888";
  const bgColor = TYPE_BG[mainType] || "#1e1e2e";

  return (
    <div style={{
      background: bgColor,
      borderRadius: 16,
      padding: compact ? 16 : 24,
      color: "#eee",
      position: "relative",
      overflow: "hidden",
      minWidth: compact ? 200 : 280,
      border: `1px solid ${typeColor}33`,
      boxShadow: `0 4px 16px ${typeColor}22`,
      transition: "transform 0.2s, box-shadow 0.2s",
    }}>
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 100, height: 100, borderRadius: "50%",
        background: `${typeColor}15`,
      }} />
      {onFavorite && (
        <button onClick={onFavorite} style={{
          position: "absolute", top: 12, right: 12,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 22, color: isFavorite ? "#ef4444" : "#555",
          zIndex: 1,
        }}>
          {isFavorite ? "\u2665" : "\u2661"}
        </button>
      )}
      {pokemon.sprite_url && (
        <div style={{
          textAlign: "center", marginBottom: 8,
          background: `radial-gradient(circle, ${typeColor}20 0%, transparent 70%)`,
          padding: 8,
        }}>
          <img
            src={pokemon.sprite_url}
            alt={pokemon.name}
            style={{
              width: compact ? 96 : 140, height: compact ? 96 : 140,
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
            }}
          />
        </div>
      )}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ color: "#888", fontSize: 12, fontWeight: 600 }}>#{String(pokemon.id).padStart(3, "0")}</span>
        <h3 style={{ margin: "4px 0 8px", textTransform: "capitalize", fontSize: compact ? 18 : 22, color: "#fff" }}>
          {pokemon.name}
        </h3>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {pokemon.types.map((t) => (
            <span key={t.name} style={{
              background: TYPE_COLORS[t.name] || "#888",
              padding: "4px 14px", borderRadius: 20, fontSize: 12,
              color: "#fff", fontWeight: 700, textTransform: "capitalize",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}>
              {t.name}
            </span>
          ))}
        </div>
      </div>
      {!compact && (
        <div style={{ marginTop: 16 }}>
          {pokemon.stats.map((s) => {
            const pct = Math.min((s.base_value / 255) * 100, 100);
            const barColor = s.base_value >= 100 ? "#22c55e" : s.base_value >= 60 ? "#eab308" : "#ef4444";
            return (
              <div key={s.name} style={{ display: "flex", alignItems: "center", marginBottom: 6, fontSize: 13 }}>
                <span style={{ width: 60, color: "#aaa", fontWeight: 600 }}>
                  {statLabels[s.name] || s.name}
                </span>
                <span style={{ width: 35, textAlign: "right", marginRight: 8, fontWeight: 700, color: barColor }}>
                  {s.base_value}
                </span>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 10 }}>
                  <div style={{
                    width: `${pct}%`,
                    height: "100%", borderRadius: 4,
                    background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
                    boxShadow: `0 0 6px ${barColor}55`,
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 14, fontSize: 13, color: "#999" }}>
            <span>Height: {pokemon.height / 10}m</span>
            <span>Weight: {pokemon.weight / 10}kg</span>
          </div>
        </div>
      )}
    </div>
  );
}
