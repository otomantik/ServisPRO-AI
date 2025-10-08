import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/providers/toast-provider";

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
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

