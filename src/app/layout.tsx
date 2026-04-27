import type { Metadata } from "next";
import { DM_Serif_Display, Noto_Serif, Open_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: ["400"],
});
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400"],
});
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Theresa Nguyen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={clsx(
        dmSerifDisplay.variable,
        notoSerif.variable,
        openSans.variable,
      )}
    >
      <body>{children}</body>
    </html>
  );
}
