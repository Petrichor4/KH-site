import type { Metadata } from "next";
import { Libre_Caslon_Display } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { getServerSession } from "next-auth";
import ClientSessionProvider from "./components/ClientSessionProvider";
import Footer from "./components/footer";

const LCD = Libre_Caslon_Display({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kierstyn Hart",
  description: "Everything you need to get caught up on the works of Kierstyn Hart",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  // console.log({ session });
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-[#828698] text-white ${LCD.className}`}>
        <ClientSessionProvider session={session}>
          <Provider>
            {children}
            <Footer />
          </Provider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
