"use client";
import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { listItems, CATEGORIES } from "@/lib/data";

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      listItems({ q, category })
        .then(setItems)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [q, category]);

  return (
    <>
      <section className="hero">
        <h1>우리 동네 중고, 쉽고 따뜻하게</h1>
        <p className="muted">이웃과 가까이에서 필요한 물건을 사고팔아요.</p>
        <input
          className="search"
          placeholder="어떤 물건을 찾으세요?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </section>

      <div className="chips">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${c === category ? "chip-on" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="muted">아직 등록된 상품이 없어요.</p>
      ) : (
        <div className="grid">
          {items.map((i) => <ItemCard key={i.id} item={i} />)}
        </div>
      )}
    </>
  );
}
