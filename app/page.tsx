'use client';
import { Monsieur_La_Doulaise } from "next/font/google";
import Nav from "./components/nav";
import { Image } from "@chakra-ui/react";

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  weight: "400",
  preload: true,
  subsets: ["latin"],
  style: "normal"
})

export default function Home() {
  return (
    <>
      <header className="w-full">
        <h1 className={`${monsieurLaDoulaise.className} text-5xl text-center p-12 pl-4`}>
          Kierstyn Hart
        </h1>
        <Nav />
      </header>
      <div className={`w-full max-h-[30vh] overflow-hidden flex justify-center items-center`}>
        <Image src="https://www.makerstations.io/content/images/size/w1200/format/webp/2022/03/olja-lobkis-studygram-04.jpeg" alt="Photo of desk with various writing accesories"/>
      </div>
      <main> 

      </main>
    </>
  );
}
