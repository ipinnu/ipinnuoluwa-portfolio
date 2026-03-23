import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ipinnuoluwa.dev"),
  title: {
    default: "Ipinnuoluwa Oladipo — Flutter & Product Engineer",
    template: "%s | Ipinnuoluwa Oladipo",
  },
  description:
    "Lagos-based mobile and product engineer. I build Flutter apps, React Native, and web products for startups and businesses.",
  keywords: [
    "Flutter developer",
    "React Native",
    "mobile app development",
    "Lagos Nigeria",
    "product engineer",
    "Next.js",
    "freelance developer",
  ],
  authors: [{ name: "Ipinnuoluwa Oladipo" }],
  creator: "Ipinnuoluwa Oladipo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ipinnuoluwa.dev",
    siteName: "Ipinnuoluwa Oladipo",
    title: "Ipinnuoluwa Oladipo — Flutter & Product Engineer",
    description:
      "Lagos-based mobile and product engineer. I build Flutter apps, React Native, and web products for startups and businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ipinnuoluwa Oladipo — Flutter & Product Engineer",
    description:
      "Lagos-based mobile and product engineer. I build Flutter apps, React Native, and web products for startups and businesses.",
    creator: "@ipinnuoluwa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg-primary text-text-primary antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
