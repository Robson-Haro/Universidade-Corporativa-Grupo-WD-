import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Universidade Corporativa Grupo WD",
  description: "Jornada do Conhecimento do Grupo WD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
