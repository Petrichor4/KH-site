"use client";
import { Blog } from "@/app/lib/definitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getBlog } from "@/app/lib/actions";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { Image } from "@chakra-ui/react";

export default function BlogPost() {
  const [blog, setBlog] = useState<Blog>(
    {id: '',
    title: '',
    post: '',
    photo: '',}
  );
  const id = Number(usePathname().split("/")[2]);

  console.log(blog);
  console.log(id);

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchBlog = async () => {
      const result = await getBlog(id);
      setBlog(result[0]);
    };
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <nav className="p-3">
        <Link href="/blog" className="active:border-none flex items-center">
          <HiArrowLeft size={40} />
        </Link>
      </nav>
      <main>
      <h1 className="p-4 md:px-20 text-2xl md:text-3xl">{blog.title}</h1>

        <div className="flex justify-center mt-[2%]">
            <Image className="w-[60%] rounded-xl" src={blog.photo} alt={`title photo for ${blog.title}`} />
        </div>
      <p className="p-4 md:p-20 md:text-xl text-justify">
        {blog.post ?? "loading..."}
      </p>
      </main>
    </>
  );
}
