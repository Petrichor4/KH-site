import { Image } from "@chakra-ui/react";
import { Book } from "../lib/definitions";
import Link from "next/link";

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex flex-col">
      <Link href={`/book/${book.id}`} className="flex justify-center items-center rounded-t-xl overflow-hidden relative hover:cursor-pointer h-[200px] w-[150px] md:h-[300px] md:w-[200px] lg:h-[400px] lg:w-[300px] duration-300">
        <Image className="min-h-full" src={book.photo} alt={`photo of ${book.photo}`} />
      </Link>
        <h2 className="p-1 text-center md:text-xl lg:text-3xl text-black bg-white rounded-b-xl h-fit w-inherit">{book.title}</h2>
    </div>
  );
}
