import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "E[X] — Northeastern Prediction Markets",
  description:
    "E[X] — Northeastern's student-run prediction markets club. Forecast real-world events, sharpen your edge. Opening Fall 2026.",
  openGraph: {
    title: "E[X] — Northeastern Prediction Markets",
    description:
      "E[X] — Forecast real-world events. Northeastern's prediction markets club, opening Fall 2026.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23f77f00' width='100' height='100' rx='4'/><text x='50' y='70' font-size='36' fill='%23000' text-anchor='middle' font-family='monospace' font-weight='bold'>E[x]</text></svg>",
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
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
