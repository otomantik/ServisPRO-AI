import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServisPro AI - Akıllı Servis Yönetimi",
  description: "AI destekli profesyonel servis yönetim platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}

