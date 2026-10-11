"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isDemo } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  if (isDemo) return <p>체험 모드에서는 로그인할 수 없어요. Supabase를 연결해 주세요.</p>;

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMsg(error ? error.message : "가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("이메일 또는 비밀번호를 확인해 주세요.");
      else router.push("/");
    }
  }

  return (
    <form className="form narrow" onSubmit={submit}>
      <h1>{mode === "login" ? "로그인" : "회원가입"}</h1>
      <label>이메일<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>비밀번호 (6자 이상)<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {msg && <p className="note">{msg}</p>}
      <button className="btn btn-primary">{mode === "login" ? "로그인" : "가입하기"}</button>
      <button type="button" className="link-btn" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        {mode === "login" ? "처음이세요? 회원가입" : "이미 계정이 있어요. 로그인"}
      </button>
    </form>
  );
}
