import { Image } from "@chakra-ui/react";
import { Book } from "../lib/definitions";
import Link from "next/link";

export default function BookCard({ book }: { book: Book }) {
  return (
    <>
      <Link href={`/book/${book.id}`} className="flex justify-center items-center rounded-xl overflow-hidden relative hover:cursor-pointer h-[200px] w-[150px] md:h-[300px] md:w-[200px] lg:h-[400px] lg:w-[300px] duration-300">
        <h2 className="book-title absolute top-0 m-2 p-2 px-4 md:text-3xl bg-white rounded-full text-black si">{book.title}</h2>
        <Image className="min-h-full" src={book.photo} alt={`photo of ${book.photo}`} />
      </Link>
    </>
  );
}
