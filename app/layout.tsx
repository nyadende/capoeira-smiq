import type { Metadata } from "next";
import { Spectral, EB_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Capoeira International — Your Voice Shapes What's Next",
  description:
    "A community research initiative gathering the single biggest challenges of capoeiristas worldwide. One question. Every voice counts.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spectral.variable} ${ebGaramond.variable} ${jetbrains.variable}`}
    >
      <body>
        <div className="glow-top" />
        <div className="glow-bottom" />
        {children}
      </body>
    </html>
  );
}
