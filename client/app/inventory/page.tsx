// FORCE CHANGE: inventory page fix


"use client";

import { useEffect, useState } from "react";
import InventoryTable from "@/components/InventoryTable";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      setError(true);
      return;
    }

    fetch(`${API_URL}/api/items`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json();
      })
      .then((json) => setItems(json.data || []))
      .catch((err) => {
        console.error("getItems error:", err);
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <div className="container" style={{ paddingTop: "2rem" }}>
        <h1 style={{ color: "var(--destructive)" }}>Connection Error</h1>
        <p>Backend API is unreachable. Please try again later.</p>
        <code style={{ display: "block", marginTop: "1rem", padding: "1rem", background: "#334155" }}>
          cd server && npm start
        </code>
      </div>
    );
  }

  return (
    <div className="container">
      <header
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Inventory</h1>
          <p style={{ color: "var(--muted-foreground)" }}>
            Manage all stock items.
          </p>
        </div>
        <a href="/add" className="btn">
          + Add Item
        </a>
      </header>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <InventoryTable initialItems={items} />
      </div>
    </div>
  );
}
