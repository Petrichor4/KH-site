"use client";
import { Blog } from "@/app/lib/definitions";
import { usePathname } from "next/navigation";
import { useIsAdmin } from "@/app/components/useIsAdmin";
import { FormEvent, useEffect, useState } from "react";
import {
  addComment,
  deleteBlogPost,
  editBlogPost,
  getBlog,
  getCommentsForBlogs,
} from "@/app/lib/actions";
import Link from "next/link";
import {
  Button,
  Fieldset,
  Stack,
  Field,
  FieldLabel,
  Input,
  Image,
  Textarea,
  Spinner,
  SkeletonCircle,
  SkeletonText,
  Switch,
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
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import CommentCard from "@/app/components/commentCard";
import { useSession } from "next-auth/react";
import { GoArrowLeft } from "react-icons/go";
import { LoginModal } from "@/app/components/loginModal";
import { BiCommentDetail } from "react-icons/bi";
import { VscClose } from "react-icons/vsc";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const MotionButton = motion.create(Button);

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

  const [blog, setBlog] = useState<Blog>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [checked, setChecked] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [show, setShow] = useState(false);
  const [post, setPost] = useState("");
  const [login, setLogin] = useState(false);
  const { isAdmin } = useIsAdmin();
  const { data: session } = useSession();
  const { scrollY } = useScroll();
  const id = Number(usePathname().split("/")[2]);
  const safeContent = DOMPurify.sanitize(blog?.post || "");
  const [showHeader, setShowHeader] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setShowHeader(latest < previous || latest < 100);
  });

  // console.log(blog.id);
  // console.log(id);
  // console.log(comments)

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchBlog = async () => {
      const result = await getBlog(id);
      setBlog(result[0]);
    };
    const fetchComments = async () => {
      const result = await getCommentsForBlogs(id);
      setComments(result);
    };
    fetchBlog();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    if (blog?.draft !== undefined) {
      setChecked(blog.draft);
    }
  }, [blog]);

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
      if (!blog) return;
      await editBlogPost(photo.toString(), title.toString(), post, blog.id, checked ? true : false);
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
      if (!blog) return;
      await deleteBlogPost(blog.id);
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
        await addComment(null, id, username, body);
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

  if (blog === undefined) {
    return (
      <main className="flex justify-center items-center">
        <Spinner size={"xl"}></Spinner>
      </main>
    );
  }

  return (
    <>
      <motion.nav
        className={`p-4 sticky top-0 left-0 z-20 h-20 md:h-24 lg:h-32 bg-gray-800 flex justify-center ease-in-out`}
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Link href="/blog" className="flex items-center  z-10">
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
            <GoArrowLeft className="h-8 w-auto md:h-12" />
          </motion.button>
        </Link>
        <motion.h1 className="text-white text-2xl md:text-3xl lg:text-5xl w-full flex justify-center items-center">
          {blog.title}
        </motion.h1>
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
      <main className="flex flex-wrap justify-center">
        {login && <LoginModal onClose={() => setLogin(false)}></LoginModal>}
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
              <div className="flex justify-between mt-4">
                <PopoverRoot closeOnInteractOutside={false}>
                  <PopoverTrigger>
                    <Button
                      type="button"
                      variant={"ghost"}
                      className="hover:bg-red-700 hover:text-white text-lg"
                      size={"lg"}
                    >
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
                <div>
                  <Switch.Root
                    colorPalette={"blue"}
                    size={"lg"}
                    pr={4}
                    onClick={() => setChecked((prev) => !prev)}
                    checked={checked}
                  >
                    <Switch.Label className="text-lg">
                      Save as draft?
                    </Switch.Label>
                    <Switch.Control />
                  </Switch.Root>

                  <Button
                    className="hover:bg-black hover:text-white text-lg"
                    type="submit"
                    variant={"ghost"}
                    size={"lg"}
                    loading={loading}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </form>
          </CustomModal>
        )}
        <div
          className="flex justify-center p-3 mb-16 w-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(31 41 55) 50%, rgba(255, 255, 255, 0) 50%)",
          }}
        >
          <Image
            className="w-auto max-h-[500px] border-2 border-black border-solid shadow-xl"
            src={blog.photo}
            alt={`title photo for ${blog.title}`}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: safeContent }}
          className="p-4 md:px-12 lg:px-40 md:text-xl text-justify indent-5 md:indent-10 pb-32 max-w-[2000px]"
        ></div>
        <section className="w-full flex items-center flex-wrap flex-col relative justify-center">
          <h3 className="text-3xl block w-full text-center">Comments</h3>
          <span className="bg-black w-11/12 md:w-2/3 h-1 block my-6 max-w-[1260px]"></span>
          <div className="w-11/12 md:w-2/3 max-w-[1260px] flex flex-wrap items-center justify-end relative">
            <Textarea
              className="bg-white border-2 border-solid border-black p-4 mb-6 z-10"
              variant={"flushed"}
              autoresize
              onFocus={() => {
                setShow(true);
                if (!session) setLogin((prev) => !prev);
              }}
              style={{ lineHeight: 1.3 }}
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="What do you think? Add a comment for Kierstyn!"
              onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
            ></Textarea>
            {show && (
              <div
                className={`flex flex-col lg:flex-row ${
                  !session ? "justify-between" : "justify-end"
                } w-full items-center`}
              >
                <AnimatePresence>
                  <motion.div
                    className="flex gap-2 max-lg:self-end self-start"
                    initial={{ y: -80 }}
                    animate={{ y: 0 }}
                  >
                    <MotionButton
                      className="mb-6 text-xl"
                      onClick={() => setShow(false)}
                      variant={"plain"}
                    >
                      Cancel
                      <VscClose />
                    </MotionButton>
                    <MotionButton
                      type="submit"
                      className="mb-6 text-xl"
                      onClick={handleAddComment}
                      variant={"plain"}
                    >
                      Comment
                      <BiCommentDetail />
                    </MotionButton>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
          <Stack className="pb-20 w-11/12 md:w-2/3 flex items-center" gapY={6}>
            {loading && (
              <div className="border-black border-2 border-solid bg-[#ffffff] p-4 pr- flex flex-wrap relative max-w-[1260px] w-full justify-start items-center">
                <div className="w-1/4 flex flex-nowrap gap-4 items-center">
                  <SkeletonCircle size={12} />
                  <div className="w-32">
                    <SkeletonText noOfLines={1} />
                  </div>
                </div>
                <div className="pr-8 pt-4 w-full">
                  <SkeletonText noOfLines={3} />
                </div>
              </div>
            )}
            {comments.map((comment) => (
              <CommentCard
                id={comment.id}
                comment={comment}
                key={comment.id}
                setLogin={() => setLogin((prev) => !prev)}
                commentRefresh={() => setRefresh((prev) => !prev)}
              ></CommentCard>
            ))}
          </Stack>
        </section>
      </main>
    </>
  );
}
