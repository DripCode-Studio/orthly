import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orthly — Apprendre le français",
  description: "Un espace d'apprentissage du français et de préparation au TFLM."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <body>{children}</body>
    </html>
  );
}
