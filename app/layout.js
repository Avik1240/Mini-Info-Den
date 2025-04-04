import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
