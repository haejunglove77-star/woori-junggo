"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isDemo } from "@/lib/supabase";

// 가게 주인 전용 로그인 (회원가입 없음)
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  if (isDemo) return <p>창고(Supabase)가 연결되지 않았어요.</p>;

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg("이메일 또는 비밀번호를 확인해 주세요.");
    else router.push("/sell");
  }

  return (
    <form className="form narrow" onSubmit={submit}>
      <h1>사장님 로그인</h1>
      <p className="muted small">매장 물건 등록은 사장님만 할 수 있어요. 손님은 로그인 없이 둘러보시면 돼요.</p>
      <label>이메일<input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>비밀번호<input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {msg && <p className="error">{msg}</p>}
      <button className="btn btn-green">로그인</button>
    </form>
  );
}
