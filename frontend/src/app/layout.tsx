import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import Navbar from "@/components/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mapa Interactivo",
  description: "Mapa interactivo de la escuela",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="overscroll-none">
      <body className={`${inter.variable} antialiased font-sans overscroll-none flex h-screen flex-col overflow-hidden`}>
        <AuthProvider>
          <div className="shrink-0">
            <Navbar />
          </div>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
