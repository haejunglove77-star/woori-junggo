"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES, createItem, uploadImage, listMyItems, updateStatus, deleteItem, won } from "@/lib/data";
import { shrinkImage } from "@/lib/shrink";
import { useUser } from "@/lib/useUser";
import { SHOP } from "@/lib/shop";

const CATS = CATEGORIES.filter((c) => c !== "전체");
const STATES = ["판매중", "예약중", "판매완료"];
const EMPTY = { title: "", price: "", category: CATS[0], location: "", description: "" };

// 사장님 전용: 휴대폰으로 사진 찍어 바로 올리고, 상태를 바꾸는 화면
export default function Admin() {
  const { user, loading } = useUser();
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [askDelete, setAskDelete] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) listMyItems(user.id).then(setItems).catch(() => {});
  }, [user]);

  if (loading) return <p className="muted">확인 중...</p>;
  if (!user) return (
    <div className="empty">
      <strong>사장님 로그인이 필요해요</strong>
      <Link href="/login" className="btn btn-green">사장님 로그인</Link>
    </div>
  );

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const small = await shrinkImage(f);
    setPhoto(small);
    setPreview(URL.createObjectURL(small));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true); setError(""); setMsg("");
    try {
      const image_url = photo ? await uploadImage(photo, user.id) : null;
      const item = await createItem({
        ...form,
        price: Number(form.price || 0),
        contact: SHOP.phone,
        image_url,
        user_id: user.id,
      });
      setItems([item, ...items]);
      setForm({ ...EMPTY, category: form.category });
      setPhoto(null); setPreview("");
      if (fileRef.current) fileRef.current.value = "";
      setMsg(`"${item.title}" 올렸어요. 홈페이지에 바로 보여요.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError("올리지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.");
    }
    setSaving(false);
  }

  async function changeStatus(id, status) {
    try {
      await updateStatus(id, status);
      setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch { setError("상태를 바꾸지 못했어요. 다시 눌러 주세요."); }
  }

  async function remove(id) {
    try {
      await deleteItem(id);
      setItems(items.filter((i) => i.id !== id));
      setAskDelete(null);
    } catch { setError("내리지 못했어요. 다시 눌러 주세요."); }
  }

  return (
    <div className="admin">
      {msg && <p className="ok-banner">✅ {msg} <Link href="/">홈페이지 보기</Link></p>}

      <form className="admin-form" onSubmit={submit}>
        <h1>새 물건 올리기</h1>

        <label className={`photo-pick ${preview ? "has" : ""}`}>
          {preview ? <img src={preview} alt="올릴 사진" /> : <span>📷<br />사진 찍기 / 고르기</span>}
          <input ref={fileRef} id="photo" type="file" accept="image/*" onChange={pick} />
        </label>

        <div className="seg-big" role="group" aria-label="카테고리">
          {CATS.map((c) => (
            <button type="button" key={c} aria-pressed={form.category === c} onClick={() => setForm({ ...form, category: c })}>{c}</button>
          ))}
        </div>

        <label>물건 이름<input id="title" required value={form.title} onChange={set("title")} placeholder="예) 삼성 양문형 냉장고" /></label>
        <label>판매 가격 (원)<input id="price" required type="number" inputMode="numeric" min="0" step="1000" value={form.price} onChange={set("price")} placeholder="예) 350000" /></label>
        <label>제품 정보<input id="info" value={form.location} onChange={set("location")} placeholder="예) LG 15kg 2021년식" /></label>
        <label>설명<textarea id="desc" rows={3} value={form.description} onChange={set("description")} placeholder="상태, 크기, 점검 내용" /></label>

        {error && <p className="error">{error}</p>}
        <button className="btn btn-orange btn-block" disabled={saving}>{saving ? "올리는 중..." : "홈페이지에 올리기"}</button>
      </form>

      <section className="admin-list">
        <h2>올린 물건 {items.length}개</h2>
        {items.length === 0 && <p className="muted">아직 올린 물건이 없어요.</p>}
        {items.map((i) => (
          <div className="admin-row" key={i.id}>
            <Link href={`/items/${i.id}`} className="admin-thumb">
              {i.image_url ? <img src={i.image_url} alt="" /> : <img src="/logo-pin.png" alt="" className="noimg" />}
            </Link>
            <div className="admin-info">
              <div className="card-title">{i.title}</div>
              <div className="price">{won(i.price)}</div>
              <div className="seg-small" role="group" aria-label="판매 상태">
                {STATES.map((s) => (
                  <button key={s} type="button" aria-pressed={i.status === s} onClick={() => changeStatus(i.id, s)}>{s}</button>
                ))}
              </div>
              {askDelete === i.id ? (
                <div className="row-tight">
                  <span className="small">정말 내릴까요?</span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(i.id)}>내리기</button>
                  <button type="button" className="link-btn" onClick={() => setAskDelete(null)}>취소</button>
                </div>
              ) : (
                <button type="button" className="link-btn small" onClick={() => setAskDelete(i.id)}>홈페이지에서 내리기</button>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
