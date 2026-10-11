"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { SHOP } from "@/lib/shop";

export default function Header() {
  const { user } = useUser();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <img src="/logo-pin.png" alt="" width="28" height="36" />
          <span>{SHOP.name}</span>
        </Link>
        <nav className="nav">
          <a href="/#items" className="nav-link">매장 물건</a>
          <a href="/#buy" className="nav-link">내 물건 팔기</a>
          <a href={`tel:${SHOP.phone}`} className="nav-tel">📞 {SHOP.phone}</a>
          {user && (
            <>
              <button className="link-btn" onClick={logout}>로그아웃</button>
              <Link href="/admin" className="btn btn-orange">물건 올리기</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
