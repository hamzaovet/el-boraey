import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "هايبر ماركت البرعي | قطاعي بسعر جملة الجملة 💙",
  description: "المنصة الذكية لهايبر ماركت البرعي - المتجر الإلكتروني ومجلة العروض الأسبوعية التفاعلية واستوديو الذكاء الاصطناعي للمعلم سامح",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-slate-950 text-white antialiased selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
