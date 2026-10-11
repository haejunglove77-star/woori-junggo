import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경변수가 없으면 체험 모드(예시 데이터)로 동작합니다.
export const isDemo = !url || !key;
export const supabase = isDemo ? null : createClient(url, key);
