"use client";
import { Blog } from "@/app/lib/definitions";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { deleteBlogPost, editBlogPost, getBlog, getUserAdminStatus } from "@/app/lib/actions";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
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
import { useSession } from "next-auth/react";
import CustomModal from "@/app/components/customModal";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const { data: session } = useSession();
  const id = Number(usePathname().split("/")[2]);
  const safeContent = DOMPurify.sanitize(blog.post);

  console.log(blog.id);
  console.log(id);

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
    } catch (error) {
      alert(`Error adding post: ${error}`);
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
      setVisible(false);
      alert("post edited sucessfully!");
    }
  };

  const handleDelete = async() => {
    try {
      await deleteBlogPost(blog.id)
      alert("Post deleted")
      window.history.back()
    } catch (error) {
      console.error(error)
      alert("Problem deleting post");
    }
  }

  return (
    <>
      <nav className="p-4 flex justify-between">
        <Link href="/blog" className="active:border-none flex items-center">
          <HiArrowLeft size={40} />
        </Link>
        {isAdmin && (
          <Button size={"lg"} onClick={() => setVisible(true)}>
            Edit
          </Button>
        )}
      </nav>
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
                    <div className="w-full h-fit mb-[5.2%]">
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        defaultValue={blog.post}
                        placeholder="Compose your epic Kierstyn Hart!"
                        onChange={(value) => setPost(value)}
                        className="h-[300px]"
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
                <Button type="submit" bg={"#828698"} size={"lg"} loading={loading}>
                  Post
                </Button>
              </div>
            </form>
          </CustomModal>
        )}

        <h1 className="p-4 md:px-20 text-2xl md:text-3xl">{blog.title}</h1>

        <div className="flex justify-center mt-[2%]">
          <Image
            className="w-auto max-h-[500px] rounded-xl"
            src={blog.photo}
            alt={`title photo for ${blog.title}`}
          />
        </div>
        <div
          className="p-8 md:px-40 md:text-xl text-justify indent-5 md:indent-10"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        ></div>
      </main>
    </>
  );
}
