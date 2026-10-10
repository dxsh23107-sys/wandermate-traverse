import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Wandermate Traverse — Less Talk. More Traverse.",
  description: "Curating offbeat high-altitude Himalayan treks, living root bridges, remote desert expeditions, and community backpacking across India and Southeast Asia.",
  keywords: ["Wandermate Traverse", "Himalayan Treks", "Spiti Valley", "Meghalaya Trek", "Kashmir Great Lakes", "Backpacking India", "Adventure Travel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${cinzel.variable} font-sans bg-dark-950 text-slate-100 min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
