"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Book } from "@/app/lib/definitions";
import { getBookById } from "@/app/lib/actions";
import { HiArrowLeft } from "react-icons/hi2";
import Link from 'next/link'
import { Image, Text } from "@chakra-ui/react";

export default function BookPage() {
  const id = usePathname().split("/")[2];
  const [book, setBook] = useState<Book>({
    id: "",
    title: "",
    description: "",
    photo: "",
    price: "",
    links: [],
  });

  useEffect(() => {
    const fetchBook = async () => {
      const result = await getBookById(id);
      setBook(result[0]);
    };
    fetchBook();
  }, [id]);

  console.log(id);
  console.log(book);

  return (
    <>
      <nav className="nav flex p-4 items-center">
        <Link href={'/'} >
            <HiArrowLeft size={40} />
        </Link>
      </nav>
      <h1 className="text-center text-2xl md:text-5xl">{book.title}</h1>
      <main className="flex items-center flex-col flex-wrap">
        <div className="flex w-10/12 mt-20 justify-center">
            <div className="image-container flex justify-center h-40 w-full md:h-80 md:w-64">
                <Image className="rounded-xl h-auto" src={book.photo} alt={`title photo for ${book.title}`}></Image>
            </div>
            <Text className="text-sm md:text-xl pl-4 text-justify md:pl-12 max-w-[50%]">{book.description}</Text>
        </div>
        <h2 className="md:text-2xl mt-8">Links to buy and read coming soon...</h2>
      </main>
    </>
  );
}
