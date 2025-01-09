import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/home/nav-bar";
import { Footer } from "@/components/home/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jaffna Muslim Association",
  description: "Together, we turn water into action",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
