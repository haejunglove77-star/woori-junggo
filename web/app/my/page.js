"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { listMyItems } from "@/lib/data";
import { useUser } from "@/lib/useUser";

export default function My() {
  const { user, loading } = useUser();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user) listMyItems(user.id).then(setItems);
  }, [user]);

  if (loading) return <p className="muted">확인 중...</p>;
  if (!user) return <p><Link href="/login">로그인</Link>이 필요해요.</p>;

  return (
    <>
      <h1>등록한 매장 물건</h1>
      {items.length === 0 ? (
        <p className="muted">아직 등록한 물건이 없어요. <Link href="/sell">첫 물건 등록하기</Link></p>
      ) : (
        <div className="grid">{items.map((i) => <ItemCard key={i.id} item={i} />)}</div>
      )}
    </>
  );
}
