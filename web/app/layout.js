import "./globals.css";
import Header from "@/components/Header";
import { SHOP } from "@/lib/shop";

export const metadata = {
  title: `${SHOP.name} | ${SHOP.slogan}`,
  description: "우리 동네 이웃과 믿고 사고파는 중고거래. 로그인 없이 누구나 둘러볼 수 있어요.",
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
              <span>{SHOP.slogan}</span>
            </div>
            <div>문의 <a href={`tel:${SHOP.phone}`}>{SHOP.phone}</a></div>
            <div className="small">직거래는 밝은 시간, 사람 많은 곳에서 만나세요.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
