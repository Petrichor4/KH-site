"use client"

import { Input } from "@chakra-ui/react";
import { Monsieur_La_Doulaise } from "next/font/google";

const monsieurLaDoulaise = Monsieur_La_Doulaise({
      weight: "400",
      preload: true,
      subsets: ["latin"],
      style: "normal",
      display: "swap",
    });

export default function Footer() {
    
    return (
        <footer className="w-full h-fit text-2xl lg:text-4xl py-10 bg-black flex justify-center items-center relative">
            <button onClick={() => window.location.assign("/")} className={`${monsieurLaDoulaise.className} antialiased absolute bottom-3 left-3 lg:p-3 antialiased text-3xl sm:text-xl lg:text-6xl text-white hover:cursor-pointer`}>K</button>
            <div className="flex items-center flex-wrap justify-center gap-2 pb-2 max-sm:w-4/5">
                <h3 className="text-white text-center">Join The Newsletter:</h3>
                <Input placeholder="Email" variant={"subtle"} className="h-9 w-2/3 pb-1 text-2xl md:text-3xl" />
            </div>
        </footer>
    )
}