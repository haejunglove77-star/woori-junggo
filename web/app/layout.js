import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "우리동네중고",
  description: "우리 동네에서 쉽게 사고파는 중고거래",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="container">{children}</main>
        <footer className="footer">© 우리동네중고</footer>
      </body>
    </html>
  );
}
