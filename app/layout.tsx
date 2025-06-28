import type { Metadata } from "next";
import { Libre_Caslon_Display } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "next-themes";
import ClientSessionProvider from "./components/ClientSessionProvider";
import Footer from "./components/footer";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const LCD = Libre_Caslon_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kierstyn Hart",
  description:
    "Everything you need to get caught up on the works of Kierstyn Hart",
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
      <Analytics />
      <SpeedInsights />
      <body  className={`bg-[#fbf8f3] text-black ${LCD.className}`}>
        <ClientSessionProvider session={session}>
          <ThemeProvider enableSystem={false}>
            <Provider>
              {children}
              <Footer />
            </Provider>
          </ThemeProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
