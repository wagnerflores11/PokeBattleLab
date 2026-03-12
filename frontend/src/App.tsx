import { useState } from "react";
import SearchView from "./components/SearchView";
import CompareView from "./components/CompareView";
import CountersView from "./components/CountersView";
import TypesView from "./components/TypesView";
import FavoritesView from "./components/FavoritesView";

type Tab = "search" | "compare" | "counters" | "types" | "favorites";

const TABS: { key: Tab; label: string }[] = [
  { key: "search", label: "Search" },
  { key: "compare", label: "Compare" },
  { key: "counters", label: "Counters" },
  { key: "types", label: "Types" },
  { key: "favorites", label: "Favorites" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("search");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a2e",
      color: "#eee",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    }}>
      <header style={{
        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        boxShadow: "0 4px 20px rgba(220,38,38,0.3)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, padding: "14px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-block", width: 28, height: 28, borderRadius: "50%", background: "#fff", border: "3px solid #333", position: "relative", overflow: "hidden" }}>
            <span style={{ display: "block", position: "absolute", top: "50%", left: 0, right: 0, height: 3, background: "#333", transform: "translateY(-50%)" }} />
            <span style={{ display: "block", position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "#ef4444", borderRadius: "50% 50% 0 0" }} />
          </span>
          <span style={{ color: "#fff" }}>Battle</span>
          <span style={{ color: "#fbbf24" }}>Dex</span>
        </h1>
        <nav style={{ display: "flex", gap: 2 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "none",
                background: tab === t.key ? "rgba(255,255,255,0.2)" : "transparent",
                color: tab === t.key ? "#fff" : "rgba(255,255,255,0.65)",
                fontWeight: tab === t.key ? 700 : 500,
                cursor: "pointer",
                fontSize: 14,
                transition: "all 0.15s",
                borderBottom: tab === t.key ? "2px solid #fbbf24" : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
        {tab === "search" && <SearchView />}
        {tab === "compare" && <CompareView />}
        {tab === "counters" && <CountersView />}
        {tab === "types" && <TypesView />}
        {tab === "favorites" && <FavoritesView />}
      </main>
    </div>
  );
}
