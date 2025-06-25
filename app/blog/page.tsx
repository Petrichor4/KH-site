"use client";
import { HiMiniPencilSquare } from "react-icons/hi2";
import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";
import {
  Button,
  IconButton,
  Fieldset,
  Stack,
  Field,
  FieldLabel,
  Input,
} from "@chakra-ui/react";
import CustomCard from "../components/customCard";
import { Blog } from "../lib/definitions";
import { addBlogPost, getBlogs } from "../lib/actions";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { signOut, useSession } from "next-auth/react";
import CustomModal from "../components/customModal";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useIsAdmin } from "../components/useIsAdmin";
import { motion } from "framer-motion";
import Nav from "../components/nav";
import { Monsieur_La_Doulaise } from "next/font/google";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  weight: "400",
  preload: true,
  subsets: ["latin"],
  style: "normal",
  display: "swap",
});

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [visibile, setVisible] = useState(false);
  const { data: session } = useSession();
  const { isAdmin } = useIsAdmin();
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  //   console.log(blogs)

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await getBlogs();
      setBlogs(response);
    };
    fetchBlogs();
  }, []);

  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const photo = formData.get("photo");
    const title = formData.get("title");
    try {
      if (!photo || !title) {
        alert("Please fill everything out Kierstyn!❤️");
        return;
      }
      await addBlogPost(photo.toString(), title.toString(), post);
      alert("post added sucessfully!");
      setVisible(false);
    } catch (error) {
      alert(`Error adding post: ${error}`);
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.3 } }}
      animate={{ opacity: 1 }}
    >
      <motion.nav
        className="top-0 left-0 z-20 bg-inherit flex flex-wrap justify-between items-center bg-grey-800"
        // style={{ padding: headerPadding }}
      >
        <Link
          href="/"
          className="active:border-none flex items-center -mr-[40px] z-10"
        >
          <button
            onClick={() => window.location.assign("/")}
            className={`${monsieurLaDoulaise.className} antialiased absolute top-[3%] left-[3%] lg:p-3 text-3xl sm:text-xl lg:text-6xl text-black hover:cursor-pointer hover:scale-[1.05] duration-200`}
          >
            K
          </button>
        </Link>
        <Nav></Nav>
        {session ? (
          <Button
            className="text-2xl lg:text-3xl lg:p-6 absolute top-[3%] right-[3%] hover:underline hidden lg:inline-flex"
            variant={"plain"}
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        ) : (
          <Link href={"/login"}>
            <Button
              className="text-2xl lg:text-3xl lg:p-6 hover:underline absolute top-[3%] right-[3%] hidden lg:inline-flex"
              variant={"plain"}
            >
              Sign In
            </Button>
          </Link>
        )}
        <h1 className="scroll-p-3.5 py-5 lg:py-20 text-3xl lg:text-8xl w-full text-center">
          Blog
        </h1>
      </motion.nav>
      <main>
        {isAdmin && (
          <IconButton
            variant={"ghost"}
            className="active:scale-95"
            m={3}
            p={3}
            onClick={() => setVisible(true)}
          >
            New Post
            <HiMiniPencilSquare />
          </IconButton>
        )}
        {visibile && (
          <CustomModal
            title="New Post"
            isOpen={true}
            onClose={() => setVisible(false)}
          >
            <form onSubmit={handlePost}>
              <Fieldset.Root>
                <Stack>
                  <Field.Root>
                    <FieldLabel>Photo</FieldLabel>
                    <Input name="photo" />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Title</FieldLabel>
                    <Input name="title" />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Post</FieldLabel>
                    <div className="w-full h-fit">
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        placeholder="Compose your epic Kierstyn Hart!"
                        onChange={(value) => setPost(value)}
                        className="h-1/2"
                      />
                    </div>
                  </Field.Root>
                </Stack>
              </Fieldset.Root>
              <div className="flex justify-end mt-4">
                <Button
                  className="hover:opacity-50"
                  type="submit"
                  bg={"#828698"}
                  size={"lg"}
                  loading={loading}
                >
                  Post
                </Button>
              </div>
            </form>
          </CustomModal>
        )}
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            500: 2,
            768: 3,
            1100: 4,
            1500: 5,
            2000: 6,
          }}
        >
          <Masonry className="p-[10px] pt-0">
            {blogs.map((blog, index) => (
              <CustomCard
                isDraft={blog.draft}
                key={index}
                post={blog}
                type="blog"
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </main>
    </motion.div>
  );
}
