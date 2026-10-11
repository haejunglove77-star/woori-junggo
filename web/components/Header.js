"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isDemo } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

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
        <Link href="/" className="logo">🥕 우리동네중고</Link>
        <nav className="nav">
          <Link href="/sell" className="btn btn-primary">판매하기</Link>
          {user ? (
            <>
              <Link href="/my">내 상품</Link>
              <button className="link-btn" onClick={logout}>로그아웃</button>
            </>
          ) : (
            <Link href="/login">로그인</Link>
          )}
        </nav>
      </div>
      {isDemo && (
        <div className="demo-bar">
          체험 모드예요. 예시 상품만 보이며, Supabase를 연결하면 실제로 사고팔 수 있어요.
        </div>
      )}
    </header>
  );
}
