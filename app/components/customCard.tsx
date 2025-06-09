import { Image } from "@chakra-ui/react";
import { Blog, Writing } from "../lib/definitions";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
      <motion.div
        whileHover={{
          scale: 0.99,
          transition: {
            duration: 0.8,
          },
        }}
        className="relative flex h-full w-full"
        onMouseEnter={() => setVisibility(true)}
        onTap={() => setVisibility(true)}
        onBlur={() => setVisibility(false)}
        onMouseLeave={() => setVisibility(false)}
      >
        <Image
          className="rounded-xl h-full w-full"
          src={post.photo}
          alt={`Title photo for blog post`}
          flex={"none"}
        ></Image>
        {visilbility && (
          <Link
            className="p-1 w-fit h-fit text-xl md:text-3xl"
            href={`/${type}/${post.id}`}
          >
            <motion.div
              initial={{opacity:0}}
              whileInView={{opacity: 0.7, transition:{duration:.5}}}
              className={`rounded-xl z-10 bg-black opacity-70 absolute w-full h-full inset-0`}
            >
              <h2 className="text-white hover:underline p-1 pl-2 h-fit w-fit cursor-pointer">
                {post.title}
              </h2>
            </motion.div>
          </Link>
        )}
      </motion.div>
    </>
  );
}
