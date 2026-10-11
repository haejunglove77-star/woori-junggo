export default function manifest() {
  return {
    name: "우리동네중고",
    short_name: "우리동네중고",
    description: "중고 냉장고 · 세탁기 · 가구 매입 · 판매",
    start_url: "/",
    display: "standalone",
    background_color: "#f4eedc",
    theme_color: "#1f6f5c",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
