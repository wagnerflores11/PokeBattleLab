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
      background: "#11111b",
      color: "#cdd6f4",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    }}>
      <header style={{
        background: "#1e1e2e",
        padding: "16px 24px",
        borderBottom: "1px solid #313244",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
          <span style={{ color: "#f38ba8" }}>Battle</span>
          <span style={{ color: "#89b4fa" }}>Dex</span>
        </h1>
        <nav style={{ display: "flex", gap: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: tab === t.key ? "#313244" : "transparent",
                color: tab === t.key ? "#cdd6f4" : "#6c7086",
                fontWeight: tab === t.key ? 700 : 400,
                cursor: "pointer",
                fontSize: 14,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        {tab === "search" && <SearchView />}
        {tab === "compare" && <CompareView />}
        {tab === "counters" && <CountersView />}
        {tab === "types" && <TypesView />}
        {tab === "favorites" && <FavoritesView />}
      </main>
    </div>
  );
}
