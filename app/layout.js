import { Poppins, Archivo, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const archivo = Archivo({
  weight: ['400', '500', '600', '700'],
  variable: "--font-archivo",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  variable: "--font-inter", // Fixed: This should be a string, not an array
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${archivo.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}