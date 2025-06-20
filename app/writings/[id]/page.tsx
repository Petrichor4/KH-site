"use client";
import { Writing, Comment } from "@/app/lib/definitions";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Spinner, Textarea } from "@chakra-ui/react";
import {
  getWriting,
  deleteWritingPost,
  editWritingPost,
  addComment,
  getCommentsForWritings,
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
import CustomModal from "@/app/components/customModal";
import CommentCard from "@/app/components/commentCard";
import { useIsAdmin } from "@/app/components/useIsAdmin";
import { sanitize } from "@/app/lib/sanitizeHTML";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useSession } from "next-auth/react";

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

  const [writing, setWriting] = useState<Writing>();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [post, setPost] = useState("");
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [show, setShow] = useState(false);
  const safeContent = sanitize(writing?.content || "");
  const id = usePathname().split("/")[2];
  const { isAdmin } = useIsAdmin();
  const { scrollY } = useScroll();
  const [showHeader, setShowHeader] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setShowHeader(latest < previous || latest < 100);
  });

  // console.log(writing);
  // console.log(comments);
  // console.log(id);

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchBlog = async () => {
      const result = await getWriting(id);
      setWriting(result[0]);
    };
    const fetchComments = async () => {
      const result = await getCommentsForWritings(parseInt(id));
      setComments(result);
    };

    fetchBlog();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

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
      await editWritingPost(
        photo.toString(),
        title.toString(),
        post,
        writing?.id || ""
      );
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
      await deleteWritingPost(writing?.id || "");
      alert("Post deleted");
      window.history.back();
    } catch (error) {
      console.error(error);
      alert("Problem deleting post");
    }
  };

  const handleAddComment = async () => {
    if (typeof session?.user?.name === "string") {
      const body = commentBody;
      const username = session?.user?.name;
      try {
        if (!commentBody.trim()) {
          alert("You cannot post an emtpy comment");
          return;
        }
        await addComment(parseInt(id), null, username, body);
      } catch (error) {
        console.error(error);
        alert(`There was a problem posting your comment: ${error}`);
      } finally {
        setRefresh((prev) => !prev);
        setShow(false);
        setCommentBody("");
      }
    }
  };

  if (writing === undefined) {
    return (
      <main className="flex justify-center items-center">
        <Spinner size={"xl"}></Spinner>
      </main>
    );
  }

  return (
    <>
      <motion.nav
        className={`p-4 sticky top-0 left-0 z-20 lg:h-32 bg-gray-800 flex justify-between items-center ease-in-out`}
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : "-100%"}}
        transition={{ duration: .3, ease: "easeInOut"}}
      >
        <Link href="/writings" className="active:border-none flex items-center">
          <motion.button
            className="hover:cursor-pointer text-white"
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
            <HiChevronLeft className="h-5 w-auto md:h-8" />
          </motion.button>
          <motion.h1 className="text-white text-xl md:text-3xl lg:text-4xl">
            {writing.title}
          </motion.h1>
        </Link>
        {isAdmin && (
          <Button
            className="text-2xl md:text-3xl text-white hover:underline"
            size={"lg"}
            variant={"plain"}
            onClick={() => setVisible(true)}
          >
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
                  type="submit"
                  size={"lg"}
                  bg={"#828698"}
                  loading={loading}
                >
                  Post
                </Button>
              </div>
            </form>
          </CustomModal>
        )}
        <div
          className="flex justify-center p-3 mb-16"
          style={{
            background:
              "linear-gradient(180deg, rgba(31 41 55) 50%, rgba(255, 255, 255, 0) 50%)",
          }}
        >
          <Image
            className="w-auto max-h-[500px] border-2 border-black border-solid shadow-xl"
            src={writing.photo}
            alt={`title photo for ${writing.title}`}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: safeContent }}
          className="p-4 lg:px-40 md:text-xl text-justify indent-5 md:indent-10 pb-32"
        ></div>
        <section className="w-full flex items-center flex-wrap flex-col relative justify-center">
          <h3 className="text-3xl block w-full text-center">Comments</h3>
          <span className="bg-black w-11/12 md:w-2/3 h-1 block my-6"></span>
          <div className="w-11/12 md:w-2/3 max-w-[1260px] flex flex-wrap items-center justify-end relative">
            <Textarea
              className="bg-white border-2 border-solid border-black p-4 mb-6"
              variant={"flushed"}
              onFocus={() => setShow(true)}
              style={{ lineHeight: 1.3 }}
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="What do you think? Add a comment for Kierstyn!"
            ></Textarea>
            {show && (
              <div className="flex justify-between w-1/2 md:w-1/3 max-w-[200px] md:max-w-[300px]">
                {!session && (
                  <Link href={"/login"} className="absolute bottom-[30%] left-0">
                    Looks like your not signed in yet click here to{" "}
                    <a className="hover:underline">Sign In</a>
                  </Link>
                )}
                <Button
                  className="mb-6 md:text-xl"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="mb-6 md:text-xl"
                  onClick={handleAddComment}
                >
                  Comment
                </Button>
              </div>
            )}
          </div>
          <Stack className="pb-20 w-11/12 md:w-2/3 flex items-center" gapY={6}>
            {comments.map((comment, index) => (
              <CommentCard
                id={comment.id}
                comment={comment}
                key={index}
                commentRefresh={() => setRefresh((prev) => !prev)}
              ></CommentCard>
            ))}
          </Stack>
        </section>
      </main>
    </>
  );
}
