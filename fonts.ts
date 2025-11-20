import { Domine, Inter, Manrope, Syne } from "next/font/google";

export const domine = Domine({
  subsets: ["latin"],
});

export const syne = Syne({
  subsets: ["latin"],
});

export const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
