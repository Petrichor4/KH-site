import { Image } from "@chakra-ui/react";
import { Blog, Writing } from "../lib/definitions";
import { useState } from "react";
import Link from "next/link";

export default function CustomCard({
  type,
  post,
}: {
  post: Blog | Writing;
  type: string;
}) {
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
          src={post.photo}
          alt={`Title photo for blog post`}
        ></Image>
        {visilbility && (
          <Link className="p-1 w-fit h-fit" href={`/${type}/${post.id}`}>
          <div
            className={`rounded-xl z-10 bg-black opacity-70 absolute w-full h-full inset-0 flex`}
          >
              <h2 className="text-white hover:underline p-1 h-fit w-fit cursor-pointer">
                {post.title}
              </h2>
          </div>
            </Link>
        )}
      </div>
    </>
  );
}
