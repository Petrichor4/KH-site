"use client";
import Link from "next/link";
import { HiArrowLeft, HiMiniPencilSquare } from "react-icons/hi2";
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
import { getWritings, getUserAdminStatus, addPost } from "../lib/actions";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

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
  const [post, setPost] = useState('');
  const { data: session } = useSession();
  const [visibile, setVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!session?.user?.name) {
      return;
    }
    const username = session?.user?.name;
    const fetchAdminStatus = async () => {
      const response = await getUserAdminStatus(username);
      if (response && response.admin !== undefined) {
        setIsAdmin(response.admin);
      }
    };
    fetchAdminStatus();
  }, [session?.user?.name]);

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
        await addPost("writings", photo.toString(), title.toString(), post);
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
      <nav className="p-8 flex justify-center">
        <Link href="/" className="active:border-none absolute top-4 left-4">
          <HiArrowLeft size={40} />
        </Link>
        <h1 className="text-5xl">Writings</h1>
        <Link className="absolute top-4 right-4" href={"/login"}>
          {session ? (
            <Button
              className="text-xl"
              variant={"ghost"}
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          ) : (
            <Button className="text-xl" variant={"ghost"}>
              Sign In/ Sign Up
            </Button>
          )}
        </Link>
      </nav>
      <main>
        {isAdmin && (
          <IconButton
            variant={"outline"}
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
