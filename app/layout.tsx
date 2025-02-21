import type { Metadata } from "next";
import { Libre_Caslon_Display } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";

const LCD = Libre_Caslon_Display({
  weight: "400",
  subsets:["latin"]
})


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-[#828698] ${LCD.className}`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
