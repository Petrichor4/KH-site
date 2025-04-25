"use client";
import Link from "next/link";
import { HiChevronLeft, HiMiniPencilSquare } from "react-icons/hi2";
import { signOut, useSession } from "next-auth/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
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
import CustomModal from "../components/customModal";
import { Writing } from "../lib/definitions";
import { useState, useEffect, FormEvent } from "react";
import { getWritings, addWritingPost } from "../lib/actions";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useIsAdmin } from "../components/useIsAdmin";
import { motion, useScroll, useTransform } from "framer-motion"


const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function Writings() {
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

  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const { data: session } = useSession();
  const [visibile, setVisible] = useState(false);
  const { isAdmin } = useIsAdmin();
  const {scrollY} = useScroll();

  //animation variables for header animation
  const headerTitleOpacity = useTransform(scrollY, [0,50], ["0","1"])
  // const headerPadding = useTransform(scrollY, [0,50], ["16px","8px"])

  useEffect(() => {
    const fetchWritings = async () => {
      const result = await getWritings();
      setWritings(result);
    };
    fetchWritings();
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
      await addWritingPost(photo.toString(), title.toString(), post);
    } catch (error) {
      alert(`Error adding post: ${error}`);
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
      setVisible(false);
      alert("post added sucessfully!");
    }
  };

  return (
    <>
      <motion.nav
        className="p-4 sticky top-0 left-0 z-20 bg-inherit flex justify-between items-center"
        // style={{ padding: headerPadding }}
      >
        <Link href="/" className="active:border-none flex items-center">
          <motion.button className="hover:cursor-pointer"
            whileHover={{
              x: 10,
              transition: { duration: .8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.9, x: 0 }}
          >
            <HiChevronLeft size={40} />
          </motion.button>
          <motion.h1
            className="text-white text-3xl lg:text-6xl"
            style={{ opacity: headerTitleOpacity }}
          >
            Writings
          </motion.h1>
        </Link>
        <Link href={"/login"}>
          {session ? (
            <Button
              className="text-2xl lg:text-3xl lg:p-6"
              variant={"ghost"}
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          ) : (
            <Button className="text-2xl lg:text-3xl lg:p-6" variant={"ghost"}>
              Sign In
            </Button>
          )}
        </Link>
      </motion.nav>
      <h1 className="p-4 pt-0 scroll-p-3.5 text-3xl lg:text-6xl">Writings</h1>
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
          <Masonry className="p-[1%] pt-0">
            {writings.map((writing, index) => (
              <CustomCard key={index} post={writing} type="writings" />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </main>
    </>
  );
}
