import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// 공개용 주소와 손님용 키예요. (비밀 키는 절대 넣지 마세요)
const url = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://utznkcxwnhmbuzkqxpmu.supabase.co";
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_F8y5vk-3_a0IeWSB4D3Dvg_EUGwPJ--";

export const isDemo = !url || !key;
export const supabase = isDemo
  ? null
  : createClient(url, key, {
      auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    });
