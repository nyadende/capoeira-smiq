import type { Metadata } from "next";
import { Playfair_Display, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
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
      className={`${playfair.variable} ${crimson.variable} ${jetbrains.variable}`}
    >
      <body>
        <div className="glow-top" />
        <div className="glow-bottom" />
        {children}
      </body>
    </html>
  );
}
