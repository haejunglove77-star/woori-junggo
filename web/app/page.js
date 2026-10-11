"use client";
import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { listItems, CATEGORIES } from "@/lib/data";
import { SHOP } from "@/lib/shop";

const TEL = `tel:${SHOP.phone}`;

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
            <p className="hero-kicker">{SHOP.what}</p>
            <h1>{SHOP.name}</h1>
            <p className="hero-slogan">{SHOP.slogan}</p>
            <p className="hero-sub">
              안 쓰는 냉장고·세탁기·가구는 저희가 사 가고,
              필요한 물건은 꼼꼼히 점검해서 합리적인 가격에 팔아요.
            </p>
            <div className="hero-actions">
              <a href="#items" className="btn btn-orange">매장 물건 보기</a>
              <a href="#buy" className="btn btn-cream">내 물건 팔기 (매입)</a>
            </div>
          </div>
          <img className="hero-img" src="/hero.png" alt="우리동네중고 매장과 사장님" />
        </div>
      </section>

      <section className="services">
        <div className="service">
          <h2>살 때</h2>
          <p>매장에 들어온 중고 냉장고, 세탁기, 가구를 직접 확인하고 점검한 뒤 판매해요. 마음에 드는 물건이 있으면 전화 주세요.</p>
          <ul className="steps">
            <li>매장에서 <strong>직접 보고</strong> 고를 수 있어요.</li>
            <li>배송·설치는 <strong>전화로 상담</strong>해 주세요.</li>
          </ul>
          <a href="#items" className="btn btn-orange">매장 물건 보기</a>
        </div>
        <div className="service" id="buy">
          <h2>팔 때 (매입)</h2>
          <ol className="steps">
            <li><strong>전화 또는 문자</strong>로 물건 사진과 모델명을 보내 주세요.</li>
            <li><strong>매입 가격</strong>을 안내해 드려요.</li>
            <li>약속한 날 <strong>방문해서 가져가고</strong> 값을 드려요.</li>
          </ol>
          <a href={TEL} className="btn btn-green">📞 매입 문의 {SHOP.phone}</a>
        </div>
      </section>

      <section id="items" className="items-section">
        <div className="section-head">
          <h2>매장 물건</h2>
          <input
            className="search"
            type="search"
            placeholder="찾는 물건 예) 양문형 냉장고, 드럼세탁기, 소파"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

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
            <strong>{q || category !== "전체" ? "찾는 물건이 없어요" : "곧 새 물건이 들어와요"}</strong>
            <span>찾으시는 물건이 있으면 전화로 말씀해 주세요. 들어오면 연락드릴게요.</span>
            <a href={TEL} className="btn btn-green">📞 {SHOP.phone}</a>
          </div>
        ) : (
          <div className="grid">
            {shown.map((i) => <ItemCard key={i.id} item={i} />)}
          </div>
        )}
      </section>
    </>
  );
}
