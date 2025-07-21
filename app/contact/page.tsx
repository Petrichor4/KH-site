"use client";

import { Button, Stack, Input, Textarea } from "@chakra-ui/react";
import Link from "next/link";
import { CiLocationOn, CiMail, CiInstagram } from "react-icons/ci";
import { motion } from "framer-motion";
import Nav from "../components/nav";
import { Monsieur_La_Doulaise } from "next/font/google";
import useHeaderData from "../components/UseHeaderData";

//   import { useState } from "react";
const monsieurLaDoulaise = Monsieur_La_Doulaise({
  weight: "400",
  preload: true,
  subsets: ["latin"],
  style: "normal",
  display: "swap",
});

export default function ContactPage() {
  
  const { headerData } = useHeaderData();

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.3 } }}
      animate={{ opacity: 1 }}
    >
      <header className="flex justify-center items-center">
        <Link
          href="/"
          className="active:border-none flex items-center pt-3 lg:p-0 z-10"
        >
          <button
            onClick={() => window.location.assign("/")}
            className={`${monsieurLaDoulaise.className} antialiased absolute pt-5 pl-5 lg:pl-10 text-4xl md:text-5xl lg:text-7xl text-black hover:cursor-pointer hover:scale-[1.05] duration-200`}
          >
            K
          </button>
        </Link>

        <Nav headerData={headerData}></Nav>
      </header>
      <main className="flex justify-center items-center flex-wrap md:flex-nowrap">
        <div className="w-5/6 md:w-1/2">
          <Stack className="p-10 contact-form">
            <h2>Name</h2>
            <Input
              variant={"subtle"}
              bg={"white"}
              color={"black"}
              size={"lg"}
            ></Input>
            <h2>Email</h2>
            <Input
              variant={"subtle"}
              bg={"white"}
              color={"black"}
              size={"lg"}
            ></Input>
            <h2>Message</h2>
            <Textarea
              variant={"subtle"}
              bg={"white"}
              color={"black"}
              size={"lg"}
            ></Textarea>
            <Button className="text-black">Submit</Button>
          </Stack>
        </div>
        <div className="flex flex-col w-1/2 content-around gap-12 items-center lg:text-2xl">
          <div className="flex items-center gap-2">
            <CiLocationOn />
            <h2>Middle of Nowhere, Iowa</h2>
          </div>
          <div className="flex items-center gap-2">
            <CiMail />
            <h2>kierstynhartwritings@gmail.com</h2>
          </div>
          <div className="flex items-center gap-2">
            <CiInstagram />
            <h2>@kierstynhart</h2>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
