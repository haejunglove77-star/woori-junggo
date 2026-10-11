"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isDemo } from "@/lib/supabase";

function explain(error) {
  const m = (error?.message || "").toLowerCase();
  if (m.includes("email not confirmed")) return "이메일 인증이 아직 안 된 계정이에요. Supabase에서 계정을 지우고 'Auto Confirm User'에 체크해서 다시 만들어 주세요.";
  if (m.includes("invalid login credentials")) return "이메일이나 비밀번호가 틀렸거나, 아직 사장님 계정이 없어요. Supabase에서 계정을 먼저 만들어 주세요.";
  if (m.includes("fetch") || m.includes("network")) return "인터넷 연결을 확인하고 다시 눌러 주세요.";
  return `로그인하지 못했어요. (${error?.message || "알 수 없는 오류"})`;
}

// 사장님 전용 로그인 (회원가입 없음)
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  if (isDemo) return <p>창고(Supabase)가 연결되지 않았어요.</p>;

  async function submit(e) {
    e.preventDefault();
    setMsg(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setMsg(explain(error));
    else router.push("/admin");
  }

  return (
    <form className="form narrow" onSubmit={submit}>
      <h1>사장님 로그인</h1>
      <p className="muted small">한 번 로그인하면 이 휴대폰에서는 계속 로그인돼 있어요.</p>
      <label>이메일<input id="email" type="email" inputMode="email" autoComplete="username" autoCapitalize="none" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>비밀번호
        <span className="pw">
          <input id="password" type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="link-btn" onClick={() => setShow(!show)}>{show ? "숨기기" : "보기"}</button>
        </span>
      </label>
      {msg && <p className="error">{msg}</p>}
      <button className="btn btn-green btn-block" disabled={busy}>{busy ? "확인 중..." : "로그인"}</button>
    </form>
  );
}
