import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo/ssr";

export const metadata: Metadata = {
  title: "SWAPI Encyclopedia",
  description:
    "Next.js + Apollo GraphQL (SSR) — mobile-first Star Wars characters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-black text-slate-100`}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
