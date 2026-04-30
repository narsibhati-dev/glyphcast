import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Silkscreen } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_CONFIG } from "@/config/site";

const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const asciiBrand = Silkscreen({
  variable: "--font-ascii-brand",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Glyphcast | ASCII Studio",
  description:
    "Drop in an image or video and tune it into ASCII art, in your browser, in real time.",
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: "Glyphcast | ASCII Studio",
    description:
      "Drop in an image or video and tune it into ASCII art, in your browser, in real time.",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glyphcast ASCII Studio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glyphcast | ASCII Studio",
    description:
      "Drop in an image or video and tune it into ASCII art, in your browser, in real time.",
    images: ["/og-image.jpg"],
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
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrainsMono.variable} ${asciiBrand.variable}`}
    >
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
