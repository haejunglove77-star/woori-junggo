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
        {item.image_url ? <img src={item.image_url} alt={item.title} /> : <span>📦</span>}
      </div>
      <div className="detail-info">
        <span className="tag">{item.status}</span>
        <h1>{item.title}</h1>
        <div className="muted small">{item.category} · {item.location} · {timeAgo(item.created_at)}</div>
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
            <div className="small muted">판매자 연락처</div>
            <div className="contact-value">{item.contact || <>가게로 문의해 주세요: <a href={`tel:${SHOP.phone}`}>{SHOP.phone}</a></>}</div>
          </div>
        )}
      </div>
    </article>
    </>
  );
}
