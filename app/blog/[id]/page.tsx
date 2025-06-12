"use client";
import { Blog } from "@/app/lib/definitions";
import { usePathname } from "next/navigation";
import { useIsAdmin } from "@/app/components/useIsAdmin";
import { FormEvent, useEffect, useState } from "react";
import {
  deleteBlogPost,
  editBlogPost,
  getBlog,
  getComments
} from "@/app/lib/actions";
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
import DOMPurify from "dompurify";
import { Comment } from "@/app/lib/definitions";
import CustomModal from "@/app/components/customModal";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { motion, useTransform, useScroll } from "framer-motion";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogPost() {
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

  const [blog, setBlog] = useState<Blog>({
    id: "",
    title: "",
    post: "",
    photo: "",
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const { isAdmin } = useIsAdmin();
  const { scrollY } = useScroll();
  const id = Number(usePathname().split("/")[2]);
  const safeContent = DOMPurify.sanitize(blog.post);

  const headerTitleOpacity = useTransform(scrollY, [0, 20], ["0", "1"]);
  const headerTitleOpacityNeg = useTransform(scrollY, [0, 10], ["1", "0"]);

  console.log(blog.id);
  console.log(id);
  console.log(comments)

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchBlog = async () => {
      const result = await getBlog(id);
      setBlog(result[0]);
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
      await editBlogPost(photo.toString(), title.toString(), post, blog.id);
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

  const handleDelete = async () => {
    try {
      await deleteBlogPost(blog.id);
      alert("Post deleted");
      window.history.back();
    } catch (error) {
      console.error(error);
      alert("Problem deleting post");
    }
  };

  return (
    <>
      <motion.nav
        className="p-4 sticky top-0 left-0 z-20 bg-inherit flex justify-between items-center"
        // style={{ padding: headerPadding }}
      >
        <Link href="/blog" className="active:border-none flex items-center">
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
            {blog.title}
          </motion.h1>
        </Link>
        {isAdmin && (
          <Button size={"lg"} variant={"outline"} onClick={() => setVisible(true)}>
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
                    <Input defaultValue={blog.photo} name="photo" />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Title</FieldLabel>
                    <Input defaultValue={blog.title} name="title" />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Post</FieldLabel>
                    <div className="w-full h-fit">
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        defaultValue={blog.post}
                        placeholder="Compose your epic Kierstyn Hart!"
                        onChange={(value) => setPost(value)}
                      />
                    </div>
                  </Field.Root>
                </Stack>
              </Fieldset.Root>
              <div className="flex justify-between items-end h-[42px] mt-4">
                <PopoverRoot closeOnInteractOutside={false}>
                  <PopoverTrigger>
                    <Button type="button" colorPalette={"red"} size={"lg"}>
                      Delete Post
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="text-black w-fit">
                    <PopoverBody>
                      <PopoverTitle fontSize={"large"} m={2}>
                        Are you sure?
                      </PopoverTitle>
                      <Button
                        type="button"
                        size={"lg"}
                        w={"full"}
                        colorPalette={"red"}
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>
                <Button
                  mt={"64px"}
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

        <motion.h1 className="p-4 md:px-20 text-2xl md:text-3xl" style={{ opacity: headerTitleOpacityNeg }}>{blog.title}</motion.h1>

        <div className="flex justify-center mt-[2%] p-3">
          <Image
            className="w-auto max-h-[500px] rounded-xl"
            src={blog.photo}
            alt={`title photo for ${blog.title}`}
          />
        </div>
        <div
          className="p-3 md:px-40 pb-40 md:text-xl text-justify indent-5 md:indent-10"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        ></div>
        <Stack>

        </Stack>
      </main>
    </>
  );
}
