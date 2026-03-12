import type { Pokemon } from "../types/pokemon";

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030",
  grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
  ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
  rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
  steel: "#B8B8D0", fairy: "#EE99AC",
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

  return (
    <div style={{
      background: "#1e1e2e",
      borderRadius: 16,
      padding: compact ? 16 : 24,
      color: "#cdd6f4",
      position: "relative",
      overflow: "hidden",
      minWidth: compact ? 200 : 280,
    }}>
      {onFavorite && (
        <button onClick={onFavorite} style={{
          position: "absolute", top: 12, right: 12,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 22, color: isFavorite ? "#f38ba8" : "#585b70",
        }}>
          {isFavorite ? "\u2665" : "\u2661"}
        </button>
      )}
      {pokemon.sprite_url && (
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <img
            src={pokemon.sprite_url}
            alt={pokemon.name}
            style={{ width: compact ? 96 : 140, height: compact ? 96 : 140, imageRendering: "pixelated" }}
          />
        </div>
      )}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ color: "#6c7086", fontSize: 13 }}>#{String(pokemon.id).padStart(3, "0")}</span>
        <h3 style={{ margin: "4px 0 8px", textTransform: "capitalize", fontSize: compact ? 18 : 22 }}>
          {pokemon.name}
        </h3>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {pokemon.types.map((t) => (
            <span key={t.name} style={{
              background: TYPE_COLORS[t.name] || "#888",
              padding: "3px 12px", borderRadius: 20, fontSize: 12,
              color: "#fff", fontWeight: 600, textTransform: "capitalize",
            }}>
              {t.name}
            </span>
          ))}
        </div>
      </div>
      {!compact && (
        <div style={{ marginTop: 16 }}>
          {pokemon.stats.map((s) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", marginBottom: 6, fontSize: 13 }}>
              <span style={{ width: 60, color: "#a6adc8", fontWeight: 600 }}>
                {statLabels[s.name] || s.name}
              </span>
              <span style={{ width: 35, textAlign: "right", marginRight: 8 }}>{s.base_value}</span>
              <div style={{ flex: 1, background: "#313244", borderRadius: 4, height: 8 }}>
                <div style={{
                  width: `${Math.min((s.base_value / 255) * 100, 100)}%`,
                  height: "100%", borderRadius: 4,
                  background: s.base_value >= 100 ? "#a6e3a1" : s.base_value >= 60 ? "#f9e2af" : "#f38ba8",
                }} />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12, fontSize: 13, color: "#a6adc8" }}>
            <span>Height: {pokemon.height / 10}m</span>
            <span>Weight: {pokemon.weight / 10}kg</span>
          </div>
        </div>
      )}
    </div>
  );
}
