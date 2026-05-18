import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PNII Sénégal — Suivi de Projet",
  description: "Plateforme Nationale d'Information Immobilière — Suivi de projet et gestion des tâches",
  authors: [{ name: "PNII Sénégal" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "PNII Sénégal — Suivi de Projet",
    description: "Plateforme Nationale d'Information Immobilière — Suivi de projet et gestion des tâches",
    url: "https://pnii.sn",
    siteName: "PNII Sénégal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PNII Sénégal — Suivi de Projet",
    description: "Plateforme Nationale d'Information Immobilière — Suivi de projet et gestion des tâches",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
