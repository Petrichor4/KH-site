import { Image } from "@chakra-ui/react";
import { Blog } from "../lib/definitions";
import { useState } from "react";
import Link from "next/link";

export default function CustomCard({ blog }: { blog: Blog }) {
  const [visilbility, setVisibility] = useState(false);

  return (
    <>
      <div
        className="relative flex h-full w-full"
        onMouseEnter={() => setVisibility(true)}
        onMouseLeave={() => setVisibility(false)}
      >
        <Image
          className="rounded-xl h-full w-full"
          src={blog.photo}
          alt={`Title photo for blog post`}
        ></Image>
        <div
          className={`${
            visilbility ? "" : "hidden"
          } rounded-xl z-10 bg-black opacity-70 absolute w-full h-full inset-0 flex`}
        >
          <Link href={`/blog/${blog.id}`}>
            <h2
              className="text-white hover:underline p-1 h-fit w-fit cursor-pointer"
            >
              {blog.title}
            </h2>
          </Link>
        </div>
      </div>
    </>
  );
}
