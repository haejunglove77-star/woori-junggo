"use client";
import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { listItems, CATEGORIES } from "@/lib/data";
import { SHOP } from "@/lib/shop";

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("전체");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      listItems({ q, category })
        .then((list) => { setItems(list); setError(""); })
        .catch(() => setError("물건을 불러오지 못했어요. 잠시 후 새로고침해 주세요."))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [q, category]);

  const shown = onlyOpen ? items.filter((i) => i.status === "판매중") : items;

  return (
    <>
      <section className="hero">
        <div className="awning" aria-hidden="true" />
        <div className="hero-body">
          <div className="hero-text">
            <h1>{SHOP.name}</h1>
            <p className="hero-slogan">{SHOP.slogan}</p>
            <p className="hero-sub">로그인 없이 누구나 편하게 둘러보세요. 마음에 드는 물건은 전화로 문의하세요.</p>
            <input
              className="search"
              type="search"
              placeholder="어떤 물건을 찾으세요? 예) 자전거, 식탁"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <img className="hero-img" src="/hero.png" alt="우리동네중고 가게와 사장님" />
        </div>
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

      <div className="list-bar">
        <span>물건 {shown.length}개</span>
        <label><input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} /> 판매중인 것만</label>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">불러오는 중...</p>
      ) : shown.length === 0 ? (
        <div className="empty">
          <img src="/logo-pin.png" alt="" width="48" height="62" />
          <strong>{q || category !== "전체" ? "찾는 물건이 없어요" : "아직 올라온 물건이 없어요"}</strong>
          <span>새 물건이 올라오면 여기에 바로 보여요.</span>
        </div>
      ) : (
        <div className="grid">
          {shown.map((i) => <ItemCard key={i.id} item={i} />)}
        </div>
      )}
    </>
  );
}
