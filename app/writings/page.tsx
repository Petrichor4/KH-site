"use client";
import Link from "next/link";
import { HiMiniPencilSquare } from "react-icons/hi2";
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
  Switch,
  Skeleton,
  // Icon,
} from "@chakra-ui/react";
// import { FaCheck, FaTimes } from "react-icons/fa";
import CustomCard from "../components/customCard";
import CustomModal from "../components/customModal";
import { Writing } from "../lib/definitions";
import { useState, useEffect, FormEvent } from "react";
import { getWritings, addWritingPost } from "../lib/actions";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useIsAdmin } from "../components/useIsAdmin";
import { motion } from "framer-motion";
import Nav from "../components/nav";
import { Monsieur_La_Doulaise } from "next/font/google";
import { LoginModal } from "../components/loginModal";

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  weight: "400",
  preload: true,
  subsets: ["latin"],
  style: "normal",
  display: "swap",
});

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

  const masonSkeleton = [
    { height: "300px", width: "full" },
    { height: "200px", width: "full" },
    { height: "280px", width: "full" },
    { height: "320px", width: "full" },
    { height: "400px", width: "full" },
    { height: "200px", width: "full" },
    { height: "300px", width: "full" },
    { height: "400px", width: "full" },
    { height: "280px", width: "full" },
    { height: "320px", width: "full" },
  ];

  const [writings, setWritings] = useState<Writing[]>([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(false);
  const [post, setPost] = useState("");
  const { data: session } = useSession();
  const [visibile, setVisible] = useState(false);
  const { isAdmin } = useIsAdmin();
  //animation variables for header animation
  // const headerTitleOpacity = useTransform(scrollY, [0, 50], ["0", "1"]);
  // const headerPadding = useTransform(scrollY, [0,50], ["16px","8px"])

  useEffect(() => {
    const fetchWritings = async () => {
      const result = await getWritings();
      if (!isAdmin) {
        const filteredResult = result.filter((result) => result.draft !== true);
        setWritings(filteredResult);
        return;
      }
      setWritings(result);
    };
    fetchWritings();
  }, [isAdmin]);

  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const photo = formData.get("photo");
    const title = formData.get("title");
    try {
      if (!photo || !title) {
        alert("Please fill everything out Kierstyn!❤️");
        setLoading(false);
        return;
      }
      await addWritingPost(
        photo.toString(),
        title.toString(),
        post,
        checked ? true : false
      );
      setLoading(false);
      setVisible(false);
      alert("post added sucessfully!");
    } catch (error) {
      alert(`Error adding post: ${error}`);
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.3 } }}
      animate={{ opacity: 1 }}
    >
      {login && <LoginModal onClose={() => setLogin(false)}></LoginModal>}
      <motion.nav
        className="top-0 left-0 z-20 flex flex-wrap justify-between items-center"
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
          <div>
            <Button
              className="text-2xl lg:text-3xl lg:p-6 hover:underline absolute top-[3%] right-[3%] hidden lg:inline-flex"
              variant={"plain"}
              onClick={() => setLogin(true)}
            >
              Sign In
            </Button>
          </div>
        )}
        <h1 className="scroll-p-3.5 py-5 lg:py-20 text-3xl lg:text-8xl w-full text-center">
          Writings
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
              <div className="flex justify-end mt-4 gap-2">
                <Switch.Root
                  colorPalette={"blue"}
                  size={"lg"}
                  onClick={() => setChecked((prev) => !prev)}
                  checked={checked}
                >
                  <Switch.Label className="text-lg">
                    Save as draft?
                  </Switch.Label>
                  <Switch.Control />
                </Switch.Root>
                <Button
                  type="submit"
                  className="hover:bg-black hover:text-white text-lg"
                  variant={"ghost"}
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
            {writings.length === 0 &&
              masonSkeleton.map((skeleton, index) => (
                <Skeleton
                  height={skeleton.height}
                  width={skeleton.width}
                  key={index}
                  variant={"shine"}
                ></Skeleton>
              ))}
            {writings.map((writing, index) => (
              <CustomCard
                isDraft={writing.draft}
                key={index}
                post={writing}
                type="writings"
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </main>
    </motion.div>
  );
}
