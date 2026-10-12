import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import "./quiz-modal.css";
import "./category-colors.css";
import "./flashcards.css";

export const metadata: Metadata = {
  title: "AWS SAA-C03 สรุปความรู้",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
