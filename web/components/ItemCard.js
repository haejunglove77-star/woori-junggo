import Link from "next/link";
import { won, timeAgo } from "@/lib/data";

export default function ItemCard({ item }) {
  return (
    <Link href={`/items/${item.id}`} className="card">
      <div className="thumb">
        {item.image_url ? <img src={item.image_url} alt={item.title} /> : <span>📦</span>}
        {item.status !== "판매중" && <span className="badge">{item.status}</span>}
      </div>
      <div className="card-body">
        <div className="card-title">{item.title}</div>
        <div className="muted small">{item.location} · {timeAgo(item.created_at)}</div>
        <div className="price">{won(item.price)}</div>
      </div>
    </Link>
  );
}
