"use client";
import { usePathname } from "next/navigation";
import { SHOP } from "@/lib/shop";

// 휴대폰 화면 아래에 늘 보이는 전화 버튼 (사장님 화면에서는 숨김)
export default function CallBar() {
  const path = usePathname();
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;
  return (
    <div className="callbar">
      <a href="/#items" className="callbar-items">매장 물건</a>
      <a href={`tel:${SHOP.phone}`} className="callbar-call">📞 전화 문의</a>
    </div>
  );
}
