import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
// @ts-ignore
import "./globals.css";
import { Providers } from "@/providers";
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vybe — Let Your Fans Choose the Music",
  description: "A real-time collaborative music queue where your audience votes on what plays next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
          <Providers>
            {children}

          </Providers>
          
          <Toaster/>
        
        </body>
      </html>
  );
}
