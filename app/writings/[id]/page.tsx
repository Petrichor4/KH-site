"use client";
import { Writing } from "@/app/lib/definitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getWriting } from "@/app/lib/actions";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { Image } from "@chakra-ui/react";
import DOMPurify from "dompurify";

export default function WritingsPost() {
  const [writing, setWriting] = useState<Writing>({
    id: "",
    title: "",
    content: "",
    photo: "",
  });
  const id = usePathname().split("/")[2];
  const safeContent = DOMPurify.sanitize(writing.content);

  console.log(writing);
  console.log(id);

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchBlog = async () => {
      const result = await getWriting(id);
      setWriting(result[0]);
    };
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <nav className="p-4">
        <Link href="/writings" className="active:border-none flex items-center">
          <HiArrowLeft size={40} />
        </Link>
      </nav>
      <main>
        <h1 className="p-4 md:px-20 text-2xl md:text-3xl">{writing.title}</h1>
        <div className="flex justify-center mt-[2%]">
          <Image
            className="w-auto max-h-[500px] rounded-xl"
            src={writing.photo}
            alt={`title photo for ${writing.title}`}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: safeContent }}
          className="p-8 md:px-40 md:text-xl text-justify indent-5 md:indent-10"
        ></div>
      </main>
    </>
  );
}
