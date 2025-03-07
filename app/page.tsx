"use client";
import { Monsieur_La_Doulaise } from "next/font/google";
import Nav from "./components/nav";
import { Image, SimpleGrid } from "@chakra-ui/react";
import InfoCard from "./components/InfoCard";
import { useState, useEffect } from "react";
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
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
      updateSize(); // Set initial size immediately
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  // Prevent rendering until size is determined
  
  
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
    const fetchBooks = async () => {
      const response = await getBooks();
      setBooks(response);
    };
    fetchBooks();
  }, []);
  
  if (!size) return null;
  return (
    <>
      <header className="w-full flex flex-wrap justify-center">
        <div className="lg:flex lg:h-screen max-w-[2000px]">
          <div className="lg:w-1/2 lg:h-full lg:flex lg:flex-col justify-around">
        {size.width < 1025 && <Nav />}
            <h1
              className={`${monsieurLaDoulaise.className} text-5xl lg:text-7xl xl:text-8xl text-center p-12 pl-4`}
            >
              Kierstyn Hart
            </h1>
            {size.width > 1025 && <InfoCard image={headerData[0]?.portrait}
          desc={headerData[0]?.about_me}/>}
          </div>
          <div
            className={`lg:w-1/2`}
          >
            <div className="lg:h-full max-md:max-h-[30vh] lg:p-6 overflow-hidden flex justify-center items-end lg:justify-end relative">
              {size.width > 1025 && <Nav />}
              <Image
                src="https://www.makerstations.io/content/images/size/w1200/format/webp/2022/03/olja-lobkis-studygram-04.jpeg"
                className="lg:h-[95%]"
                alt="Photo of desk with various writing accesories"
              />
            </div>
          </div>
        </div>
        {size.width < 1025 && <InfoCard
          image={headerData[0]?.portrait}
          desc={headerData[0]?.about_me}
        />}
      </header>
      <main className="mt-4">
        <h2 className="text-center text-3xl lg:text-5xl p-4">Books</h2>
        <SimpleGrid columns={{ base: 2, lg: 3 }} p={4}>
          {books.map((book, index) => (
            <div className="flex justify-center my-2.5" key={index}>
              <BookCard book={book} />
            </div>
          ))}
        </SimpleGrid>
      </main>
    </>
  );
}
