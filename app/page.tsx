"use client";
import { Monsieur_La_Doulaise } from "next/font/google";
import Nav from "./components/nav";
import { Image } from "@chakra-ui/react";
import InfoCard from "./components/InfoCard";
import { useState, useEffect } from 'react';
import { HeaderData } from "./lib/definitions";
import { getHeaderData } from "./lib/actions";

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  weight: "400",
  preload: true,
  subsets: ["latin"],
  style: "normal",
});

export default function Home() {
    const [headerData, setHeaderData] = useState<HeaderData[]>([]);
  
    console.log(headerData);
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await getHeaderData();
        if (response) {
          setHeaderData(response);
        }
      };
      fetchData();
    }, []);
  
  return (
    <>
      <header className="w-full">
        <h1
          className={`${monsieurLaDoulaise.className} text-5xl text-center p-12 pl-4`}
        >
          Kierstyn Hart
        </h1>
        <Nav />
        <div
          className={`w-full max-h-[30vh] overflow-hidden flex justify-center items-center`}
        >
          <Image
            src="https://www.makerstations.io/content/images/size/w1200/format/webp/2022/03/olja-lobkis-studygram-04.jpeg"
            alt="Photo of desk with various writing accesories"
          />
        </div>
        <InfoCard image={headerData[0]?.portrait} desc={headerData[0]?.about_me} />
      </header>
      <main>
        <h2 className="text-center text-3xl p-4">Books</h2>
      </main>
    </>
  );
}
