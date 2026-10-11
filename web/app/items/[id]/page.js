"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getItem, updateStatus, deleteItem, won, timeAgo } from "@/lib/data";
import { useUser } from "@/lib/useUser";

export default function ItemDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [item, setItem] = useState(undefined);

  useEffect(() => {
    getItem(id).then(setItem);
  }, [id]);

  if (item === undefined) return <p className="muted">불러오는 중...</p>;
  if (item === null) return <p>상품을 찾을 수 없어요.</p>;

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
            <div>{item.contact || "로그인 후 판매자에게 문의해 보세요."}</div>
          </div>
        )}
      </div>
    </article>
  );
}
