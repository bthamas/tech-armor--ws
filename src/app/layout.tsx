import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";
import FloatingCart from "@/components/FloatingCart";

const plusJakartaStatus = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "TechArmor | Prémium Készülékvédelem",
  description: "Prémium minőségű telefon kiegészítők, tokok és fóliák.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${plusJakartaStatus.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <FloatingCart />
        </Providers>
      </body>
    </html>
  );
}
