import "./globals.css";
import Header from "@/components/Header";
import CallBar from "@/components/CallBar";
import { SHOP } from "@/lib/shop";

export const viewport = { themeColor: "#1f6f5c" };

export const metadata = {
  title: `${SHOP.name} | ${SHOP.slogan}`,
  description: "중고 냉장고, 세탁기, 가구를 정직하게 사고 파는 동네 중고매장 우리동네중고.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body>
        <Header />
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container footer-inner">
            <div className="footer-brand">
              <img src="/logo-pin.png" alt="" width="22" height="28" />
              <strong>{SHOP.name}</strong>
              <span>{SHOP.what}</span>
            </div>
            <div>문의 <a href={`tel:${SHOP.phone}`}>{SHOP.phone}</a></div>
            <div className="small">{SHOP.slogan}</div>
            <a href="/admin" className="owner-link">매장 관리</a>
          </div>
        </footer>
        <CallBar />
      </body>
    </html>
  );
}
