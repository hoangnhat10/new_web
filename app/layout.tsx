/**
 * Layout chính của ứng dụng
 * Bao gồm metadata, font và cấu trúc HTML cơ bản
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Cổng Nhôm Đúc - Sản phẩm và Dịch vụ Chất Lượng",
  description: "Chuyên cung cấp cổng nhôm đúc, hàng rào nhôm đúc và các dịch vụ thi công uy tín, chất lượng cao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

