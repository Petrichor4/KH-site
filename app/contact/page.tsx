"use client";

import { Button, Stack, Input, Textarea } from "@chakra-ui/react";
import Link from "next/link";
import { CiLocationOn, CiMail, CiInstagram } from "react-icons/ci";
import { motion } from "framer-motion"
import { GoArrowLeft } from "react-icons/go";

//   import { useState } from "react";

export default function ContactPage() {
  // const [loading, setLoading] = useState(false);

  // const handleSubmitContact = async() => {

  // }

  return (
    <>
      <main className="flex justify-center items-center flex-wrap md:flex-nowrap">
        <Link href="/" className="active:border-none absolute top-4 left-4">
        <motion.button className="hover:cursor-pointer"
            whileHover={{
              x: 10,
              transition: { duration: .8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.9, x: 0 }}
          >
            <GoArrowLeft size={40} />
          </motion.button>
        </Link>
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
            <h2>Salt Lake City, Utah</h2>
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
    </>
  );
}
