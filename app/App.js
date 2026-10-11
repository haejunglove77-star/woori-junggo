import { useEffect, useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, FlatList, Image, Pressable, ScrollView, StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { supabase, isDemo } from "./supabase";

const DEMO_ITEMS = [
  { id: "1", title: "아이패드 9세대 64GB", price: 280000, location: "역삼동", status: "판매중", description: "1년 사용, 케이스 같이 드려요.", contact: "" },
  { id: "2", title: "원목 4인 식탁", price: 90000, location: "망원동", status: "판매중", description: "이사 때문에 내놓아요.", contact: "" },
  { id: "3", title: "어린이 자전거 16인치", price: 35000, location: "상도동", status: "예약중", description: "보조바퀴 포함.", contact: "" },
];

const won = (n) => (n === 0 ? "나눔" : `${Number(n).toLocaleString("ko-KR")}원`);

export default function App() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (isDemo) {
      setItems(DEMO_ITEMS.filter((i) => i.title.includes(q)));
      return;
    }
    let query = supabase.from("items").select("*").order("created_at", { ascending: false });
    if (q) query = query.ilike("title", `%${q}%`);
    query.then(({ data }) => setItems(data || []));
  }, [q]);

  if (selected) {
    return (
      <SafeAreaView style={s.screen}>
        <Pressable onPress={() => setSelected(null)} style={s.back}><Text>← 목록으로</Text></Pressable>
        <ScrollView>
          <View style={s.bigImg}>
            {selected.image_url ? <Image source={{ uri: selected.image_url }} style={s.fill} /> : <Text style={s.emoji}>📦</Text>}
          </View>
          <View style={s.pad}>
            <Text style={s.status}>{selected.status}</Text>
            <Text style={s.h1}>{selected.title}</Text>
            <Text style={s.muted}>{selected.location}</Text>
            <Text style={s.bigPrice}>{won(selected.price)}</Text>
            <Text style={s.desc}>{selected.description}</Text>
            {!!selected.contact && <Text style={s.contact}>연락: {selected.contact}</Text>}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar style="dark" />
      <Text style={s.logo}>🥕 우리동네중고</Text>
      {isDemo && <Text style={s.demo}>체험 모드: 예시 상품만 보여요</Text>}
      <TextInput style={s.search} placeholder="어떤 물건을 찾으세요?" value={q} onChangeText={setQ} />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        ListEmptyComponent={<Text style={[s.muted, s.pad]}>아직 등록된 상품이 없어요.</Text>}
        renderItem={({ item }) => (
          <Pressable style={s.row} onPress={() => setSelected(item)}>
            <View style={s.thumb}>
              {item.image_url ? <Image source={{ uri: item.image_url }} style={s.fill} /> : <Text style={s.emojiSm}>📦</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.title} numberOfLines={1}>{item.title}</Text>
              <Text style={s.muted}>{item.location} · {item.status}</Text>
              <Text style={s.price}>{won(item.price)}</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  logo: { fontSize: 22, fontWeight: "800", color: "#ff6f0f", padding: 16, paddingBottom: 8 },
  demo: { marginHorizontal: 16, color: "#b45309", fontSize: 12 },
  search: { margin: 16, padding: 12, borderRadius: 999, backgroundColor: "#f7f8fa", fontSize: 16 },
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eaebee" },
  thumb: { width: 90, height: 90, borderRadius: 10, backgroundColor: "#f7f8fa", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  fill: { width: "100%", height: "100%" },
  emojiSm: { fontSize: 32 },
  emoji: { fontSize: 72 },
  title: { fontSize: 16, marginBottom: 4 },
  muted: { color: "#868b94", fontSize: 13 },
  price: { fontWeight: "700", marginTop: 6, fontSize: 15 },
  back: { padding: 16 },
  bigImg: { aspectRatio: 1, backgroundColor: "#f7f8fa", alignItems: "center", justifyContent: "center" },
  pad: { padding: 16 },
  status: { alignSelf: "flex-start", backgroundColor: "#f7f8fa", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontSize: 12 },
  h1: { fontSize: 22, fontWeight: "700", marginTop: 8 },
  bigPrice: { fontSize: 20, fontWeight: "700", marginVertical: 12 },
  desc: { fontSize: 15, lineHeight: 22 },
  contact: { marginTop: 16, padding: 12, borderWidth: 1, borderColor: "#eaebee", borderRadius: 10 },
});
