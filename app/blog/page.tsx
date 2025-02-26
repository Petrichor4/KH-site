"use client";
import { HiArrowLeft, HiMiniPencilSquare } from "react-icons/hi2";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IconButton } from "@chakra-ui/react";
import CustomCard from "../components/customCard";
import { Blog } from "../lib/definitions";
import { getBlogs } from "../lib/actions";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

//   console.log(blogs)

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await getBlogs();
      setBlogs(response);
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <nav className="p-3">
        <Link href="/" className="active:border-none flex items-center">
          <HiArrowLeft size={40} />
          <h1 className="text-5xl">Blog</h1>
        </Link>
      </nav>
      <main>
        <IconButton variant={"outline"} className="active:bg-white" m={3} p={3}>
          New Post
          <HiMiniPencilSquare />
        </IconButton>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 500: 2, 768: 3, 1100: 4, 1500: 5, 2000: 6 }}
        >
            <Masonry className="p-[1%]">
                {blogs.map((blog, index) => (
                    <CustomCard key={index} blog={blog} />
                ))}
            </Masonry>
        </ResponsiveMasonry>
      </main>
    </>
  );
}
