"use client";
import { Writing, Comment } from "@/app/lib/definitions";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getWriting, deleteWritingPost, editWritingPost, getComments } from "@/app/lib/actions";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi2";
import {
  Button,
  Fieldset,
  Stack,
  Field,
  FieldLabel,
  Input,
  Image,
} from "@chakra-ui/react";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomModal from "@/app/components/customModal";
import CommentCard from "@/app/components/commentCard";
import { useIsAdmin } from "@/app/components/useIsAdmin";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { motion, useTransform, useScroll } from "framer-motion";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });


export default function WritingsPost() {

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

  const [writing, setWriting] = useState<Writing>({
    id: "",
    title: "",
    content: "",
    photo: "",
  });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [post, setPost] = useState('');
  const [comments, setComments] = useState();
  const safeContent = DOMPurify.sanitize(writing.content);
  const id = usePathname().split("/")[2];
  const { isAdmin } = useIsAdmin();
  const { scrollY } = useScroll();

  const headerTitleOpacity = useTransform(scrollY, [0, 50], ["0", "1"]);


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
        const fetchComments = async () => {
          const result = await getComments(id.toString())
          setComments(result);
        }
    
    fetchBlog();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    const handleEditPost = async (e: FormEvent<HTMLFormElement>) => {
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
        await editWritingPost(photo.toString(), title.toString(), post, writing.id);
        alert("post edited sucessfully!");
        setVisible(false);
      } catch (error) {
        alert(`Error adding post: ${error}`);
        setLoading(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = async() => {
      try {
        await deleteWritingPost(writing.id)
        alert("Post deleted")
        window.history.back()
      } catch (error) {
        console.error(error)
        alert("Problem deleting post");
      }
    }
  

  return (
    <>
      <motion.nav
        className="p-4 sticky top-0 left-0 z-20 bg-inherit flex justify-between items-center"
        // style={{ padding: headerPadding }}
      >
        <Link href="/writings" className="active:border-none flex items-center">
          <motion.button
            className="hover:cursor-pointer"
            whileHover={{
              x: 10,
              transition: {
                duration: 0.8,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              },
            }}
            whileTap={{ scale: 0.9, x: 0 }}
          >
            <HiChevronLeft size={40} />
          </motion.button>
          <motion.h1
            className="text-white text-3xl lg:text-6xl"
            style={{ opacity: headerTitleOpacity }}
          >
            {writing.title}
          </motion.h1>
        </Link>
        {isAdmin && (
          <Button size={"lg"} onClick={() => setVisible(true)}>
            Edit
          </Button>
        )}
      </motion.nav>
      <main>
      {visible && (
          <CustomModal
            title="New Post"
            isOpen={true}
            onClose={() => setVisible(false)}
          >
            <form onSubmit={handleEditPost}>
              <Fieldset.Root>
                <Stack>
                  <Field.Root>
                    <FieldLabel>Photo</FieldLabel>
                    <Input defaultValue={writing.photo} name="photo" />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Title</FieldLabel>
                    <Input defaultValue={writing.title} name="title" />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Post</FieldLabel>
                    <div className="w-full h-fit">
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        defaultValue={writing.content}
                        placeholder="Compose your epic Kierstyn Hart!"
                        onChange={(value) => setPost(value)}
                      />
                    </div>
                  </Field.Root>
                </Stack>
              </Fieldset.Root>
              <div className="flex justify-between mt-4">
                <PopoverRoot closeOnInteractOutside={false}>
                  <PopoverTrigger>
                    <Button type="button" colorPalette={"red"} size={"lg"}>Delete Post</Button>
                  </PopoverTrigger>
                  <PopoverContent className="text-black w-fit">
                    <PopoverBody>
                      <PopoverTitle fontSize={"large"} m={2}>Are you sure?</PopoverTitle>
                      <Button type="button" size={'lg'} w={"full"} colorPalette={"red"} onClick={handleDelete}>Delete</Button>
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>
                <Button type="submit" size={"lg"} bg={"#828698"} loading={loading}>
                  Post
                </Button>
              </div>
            </form>
          </CustomModal>
        )}

        <h1 className="p-4 md:px-20 text-2xl md:text-3xl">{writing.title}</h1>
        <div className="flex justify-center mt-[2%] p-3">
          <Image
            className="w-auto max-h-[500px] rounded-xl"
            src={writing.photo}
            alt={`title photo for ${writing.title}`}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: safeContent }}
          className="p-3 md:px-40 md:text-xl text-justify indent-5 md:indent-10 pb-40"
        ></div>
        <Stack>
          {/* <CommentCard text= ></CommentCard> */}
        </Stack>
      </main>
    </>
  );
}
