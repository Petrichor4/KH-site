"use client";
import { Monsieur_La_Doulaise } from "next/font/google";
import Nav from "./components/nav";
import { Image, SimpleGrid } from "@chakra-ui/react";
import InfoCard from "./components/InfoCard";
import { useState, useEffect } from 'react';
import { HeaderData, Book } from "./lib/definitions";
import { getBooks, getHeaderData } from "./lib/actions";
import BookCard from "./components/bookCard";

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  weight: "400",
  preload: true,
  subsets: ["latin"],
  style: "normal",
});

export default function Home() {
    const [headerData, setHeaderData] = useState<HeaderData[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
  
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

    useEffect(() => {
      const fetchBooks = async() => {
        const response = await getBooks();
        setBooks(response) 
      }
      fetchBooks();
    },[])
  
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
        <h2 className="text-center text-3xl md:text-5xl p-4">Books</h2>
          <SimpleGrid columns={{base: 2, md: 3}} p={4}>
            {books.map((book, index) => (
                <div className="flex justify-center my-2.5" key={index}>
                  <BookCard book={book}/>
                </div>
            ))}
          </SimpleGrid>
      </main>
    </>
  );
}
