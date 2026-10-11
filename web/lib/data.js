import { supabase, isDemo } from "./supabase";

export const CATEGORIES = ["전체", "디지털기기", "가구/인테리어", "생활가전", "의류", "도서", "유아동", "스포츠", "기타"];

const DEMO_ITEMS = [
  { id: "1", title: "아이패드 9세대 64GB", price: 280000, category: "디지털기기", location: "역삼동", description: "1년 사용, 케이스 같이 드려요. 생활기스 거의 없습니다.", image_url: null, status: "판매중", created_at: "2026-10-10T09:00:00Z", user_id: "demo" },
  { id: "2", title: "원목 4인 식탁", price: 90000, category: "가구/인테리어", location: "망원동", description: "이사 때문에 내놓아요. 직접 가져가셔야 해요.", image_url: null, status: "판매중", created_at: "2026-10-09T09:00:00Z", user_id: "demo" },
  { id: "3", title: "어린이 자전거 16인치", price: 35000, category: "유아동", location: "상도동", description: "보조바퀴 포함. 타이어 상태 좋아요.", image_url: null, status: "예약중", created_at: "2026-10-08T09:00:00Z", user_id: "demo" },
  { id: "4", title: "해리포터 전집", price: 40000, category: "도서", location: "역삼동", description: "1~7권 세트, 깨끗하게 봤어요.", image_url: null, status: "판매완료", created_at: "2026-10-07T09:00:00Z", user_id: "demo" },
];

export async function listItems({ q = "", category = "전체" } = {}) {
  if (isDemo) {
    return DEMO_ITEMS.filter(
      (i) => (category === "전체" || i.category === category) && i.title.includes(q)
    );
  }
  let query = supabase.from("items").select("*").order("created_at", { ascending: false });
  if (category !== "전체") query = query.eq("category", category);
  if (q) query = query.ilike("title", `%${q}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getItem(id) {
  if (isDemo) return DEMO_ITEMS.find((i) => i.id === id) || null;
  const { data, error } = await supabase.from("items").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function listMyItems(userId) {
  const { data, error } = await supabase
    .from("items").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function uploadImage(file, userId) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("item-images").upload(path, file);
  if (error) throw error;
  return supabase.storage.from("item-images").getPublicUrl(path).data.publicUrl;
}

export async function createItem(item) {
  const { data, error } = await supabase.from("items").insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateStatus(id, status) {
  const { error } = await supabase.from("items").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteItem(id) {
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw error;
}

export function won(n) {
  return n === 0 ? "나눔" : `${Number(n).toLocaleString("ko-KR")}원`;
}

export function timeAgo(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "방금 전";
  if (s < 3600) return `${Math.floor(s / 60)}분 전`;
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`;
  return `${Math.floor(s / 86400)}일 전`;
}
