import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientParticles } from "@/components/ClientParticles";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Soil Crest Naturals — R&D Dossier",
  description:
    "Confidential product roadmap and AI research platform for Soil Crest Naturals — India's premium superfood brand.",
  openGraph: {
    title: "Soil Crest Naturals — R&D Dossier",
    description:
      "Confidential product roadmap and AI research platform for Soil Crest Naturals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning prevents false positives from browser extensions
          (e.g. Grammarly injecting data-gr-ext-installed onto body) */}
      <body
        className="min-h-full flex flex-col grain-overlay"
        suppressHydrationWarning
      >
        <ClientParticles />
        {children}
      </body>
    </html>
  );
}
