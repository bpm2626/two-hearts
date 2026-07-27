import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Two Hearts — a private pre-marriage questionnaire",
  description:
    "A gentle, private questionnaire for couples preparing for marriage. Your answers are never shared with your partner — only a compatibility report that shows where you align and what to talk about.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
