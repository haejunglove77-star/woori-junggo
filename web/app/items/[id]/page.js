"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getItem, updateStatus, deleteItem, won, timeAgo } from "@/lib/data";
import { useUser } from "@/lib/useUser";
import { SHOP } from "@/lib/shop";

export default function ItemDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [item, setItem] = useState(undefined);

  useEffect(() => {
    getItem(id).then(setItem);
  }, [id]);

  if (item === undefined) return <p className="muted">불러오는 중...</p>;
  if (item === null) return <div className="empty"><strong>물건을 찾을 수 없어요</strong><a href="/" className="btn btn-green">목록으로 가기</a></div>;

  const isMine = user && user.id === item.user_id;

  async function changeStatus(status) {
    await updateStatus(item.id, status);
    setItem({ ...item, status });
  }

  async function remove() {
    if (!confirm("정말 삭제할까요?")) return;
    await deleteItem(item.id);
    router.push("/my");
  }

  return (
    <>
    <a href="/" className="back">← 목록으로</a>
    <article className="detail">
      <div className="detail-img">
        {item.image_url ? <img src={item.image_url} alt={item.title} /> : <img src="/logo-pin.png" alt="" className="noimg" />}
      </div>
      <div className="detail-info">
        <span className="tag">{item.status}</span>
        <h1>{item.title}</h1>
        <div className="muted small">{[item.category, item.location].filter(Boolean).join(" · ")} · {timeAgo(item.created_at)} 입고</div>
        <div className="price big">{won(item.price)}</div>
        <p className="desc">{item.description}</p>

        {isMine ? (
          <div className="row">
            <select value={item.status} onChange={(e) => changeStatus(e.target.value)}>
              <option>판매중</option>
              <option>예약중</option>
              <option>판매완료</option>
            </select>
            <button className="btn btn-danger" onClick={remove}>삭제</button>
          </div>
        ) : (
          <div className="contact">
            <div className="small muted">구매 · 배송 문의</div>
            <a className="contact-value" href={`tel:${SHOP.phone}`}>📞 {SHOP.phone}</a>
            <div className="small muted">매장에 직접 오셔서 보셔도 좋아요. 배송·설치는 전화로 상담해 주세요.</div>
          </div>
        )}
      </div>
    </article>
    </>
  );
}
