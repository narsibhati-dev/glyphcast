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
  // Landing/studio use `font-satoshi` for most UI; preloading every Archivo
  // weight triggers Chrome "preloaded but not used" while Satoshi paints first.
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

const asciiBrand = Silkscreen({
  variable: "--font-ascii-brand",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Glyphcast | ASCII Studio",
  description:
    "Drop in an image or video and tune it into ASCII art, in your browser, in real time.",
  metadataBase: new URL(SITE_CONFIG.url),
  icons: {
    icon: [
      { url: "/favicon/icon0.svg", type: "image/svg+xml" },
      { url: "/favicon/icon1.png", type: "image/png" },
      { url: "/favicon/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/favicon/apple-icon.png" }],
    shortcut: ["/favicon/favicon.ico"],
  },
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrainsMono.variable} ${asciiBrand.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var k='glyphcast-theme';
    var def='light';
    var s=localStorage.getItem(k);
    var t=(s==='light'||s==='dark')?s:def;
    var d=document.documentElement;
    d.classList.toggle('dark',t==='dark');
    d.style.colorScheme=t;
  } catch(e) {}
})();`,
          }}
        />
      </head>
      <body
        className="min-h-full font-sans antialiased"
        suppressHydrationWarning
      >
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
