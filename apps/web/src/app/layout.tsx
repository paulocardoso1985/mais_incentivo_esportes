import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Mais Corporativo Esportes | Incentivo & Experiências",
    description: "Plataforma de incentivo e prêmios Mais Corporativo",
    manifest: "/manifest.json",
};

export const viewport = {
    themeColor: "#0c2444",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
