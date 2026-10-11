"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, createItem, uploadImage } from "@/lib/data";
import { isDemo } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { SHOP } from "@/lib/shop";

export default function Sell() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", price: "", category: "냉장고", location: "", description: "", contact: SHOP.phone,
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (isDemo) return <p>체험 모드에서는 판매 등록을 할 수 없어요. Supabase를 연결해 주세요.</p>;
  if (loading) return <p className="muted">확인 중...</p>;
  if (!user) return (
    <div className="empty">
      <strong>매장 물건 등록은 사장님만 할 수 있어요</strong>
      <span>둘러보기는 로그인 없이 누구나 할 수 있어요.</span>
      <Link href="/" className="btn btn-green">물건 구경하러 가기</Link>
    </div>
  );

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const image_url = file ? await uploadImage(file, user.id) : null;
      const item = await createItem({
        ...form,
        price: Number(form.price || 0),
        image_url,
        user_id: user.id,
      });
      router.push(`/items/${item.id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h1>매장 물건 등록</h1>
      <label>사진<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} /></label>
      <label>제목<input required value={form.title} onChange={set("title")} placeholder="예) 삼성 양문형 냉장고" /></label>
      <label>판매 가격 (원)<input type="number" min="0" step="1000" required value={form.price} onChange={set("price")} /></label>
      <label>카테고리
        <select value={form.category} onChange={set("category")}>
          {CATEGORIES.filter((c) => c !== "전체").map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>제품 정보 (브랜드 · 용량 · 연식)<input required value={form.location} onChange={set("location")} placeholder="예) LG 15kg 2021년식" /></label>
      <label>설명<textarea rows={5} value={form.description} onChange={set("description")} placeholder="점검 내용, 상태, 크기 등을 적어 주세요" /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary" disabled={saving}>{saving ? "등록 중..." : "등록하기"}</button>
    </form>
  );
}
