import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "lc timer",
  description: "Countdown to the Leaving Cert.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* apply the saved theme before first paint */}
        <Script id="theme" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
