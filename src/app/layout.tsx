import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "הצבעת תחפושות",
  description: "הצביעו לתחפושת האהובה עליכם",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
