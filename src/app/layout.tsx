import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaceUp.AI — Suas fotos de retrato em minutos, não em dias",
  description: "Transforme selfies em fotos profissionais com IA. Para LinkedIn, currículo e redes sociais. Mais de 2 milhões de fotos geradas.",
  keywords: "foto profissional ia, headshot ai, foto linkedin, foto corporativa, retrato profissional ia",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "FaceUp.AI — Suas fotos de retrato em minutos, não em dias",
    description: "Transforme selfies em fotos profissionais com IA. Mais de 2 milhões de fotos geradas.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
