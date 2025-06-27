"use client";

import { useEffect, useState } from "react";
import Nav from "../components/nav";
import { Link, Text, Textarea } from "@chakra-ui/react";
import { editEventText, getHeaderData } from "../lib/actions";
import { useIsAdmin } from "../components/useIsAdmin";
import { Monsieur_La_Doulaise } from "next/font/google";

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  weight: "400",
  preload: true,
  subsets: ["latin"],
  style: "normal",
  display: "swap",
});


export default function EventPage() {
  const [text, setText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { isAdmin } = useIsAdmin();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchText = async () => {
      const result = await getHeaderData();
      if (result) setText(result[0].events);
    };
    fetchText();
  }, [refresh]);

  const handleEdit = async () => {
    try {
      if (!isAdmin) return;
      await editEventText(text);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(text);

  return (
    <>
      <header className="">
        <nav className="flex justify-center items-center">
          <Link
            href="/"
            className="active:border-none flex items-center pt-3 lg:p-0 z-10"
          >
            <button
              onClick={() => window.location.assign("/")}
              className={`${monsieurLaDoulaise.className} antialiased absolute pt-5 pl-5 lg:pl-10 text-4xl md:text-5xl lg:text-7xl text-black hover:cursor-pointer hover:scale-[1.05] duration-200 font-thin`}
            >
              K
            </button>
          </Link>

          <Nav></Nav>
        </nav>
      </header>
      <main className="text-xl md:text-5xl flex  justify-center items-center">
        {edit ? (
          <Textarea
            className="w-2/3 text-5xl h-[300px] overflow-auto"
            style={{ scrollbarWidth: "none" }}
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleEdit();
                setEdit(false);
              }
            }}
          ></Textarea>
        ) : (
          <Text
            onClick={() => {
              if (isAdmin) setEdit(true);
            }}
            className="w-2/3 text-center"
          >
            {text}
          </Text>
        )}
      </main>
    </>
  );
}
