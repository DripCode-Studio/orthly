import type { Metadata } from "next";
import "./globals.css";
import { Geist, Nunito_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-heading", weight: ["700", "800", "900"] });

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
    <html lang="fr-CA" className={cn("font-sans", geist.variable, nunito.variable)}>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
