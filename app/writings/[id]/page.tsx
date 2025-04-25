"use client";
import { Writing } from "@/app/lib/definitions";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getWriting, getUserAdminStatus, deleteWritingPost, editWritingPost } from "@/app/lib/actions";
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
import { useSession } from "next-auth/react";
import CustomModal from "@/app/components/customModal";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

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
  const id = usePathname().split("/")[2];
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [post, setPost] = useState('');
  const {data: session} = useSession();
  const safeContent = DOMPurify.sanitize(writing.content);

  console.log(writing);
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
      const result = await getWriting(id);
      setWriting(result[0]);
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
        await editWritingPost(photo.toString(), title.toString(), post, writing.id);
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
      <nav className="p-4 flex justify-between">
        <Link href="/writings" className="active:border-none flex items-center">
          <HiChevronLeft size={40} />
        </Link>
        {isAdmin && (
          <Button fontSize={"2xl"} variant={"ghost"} size={"lg"} onClick={() => setVisible(true)}>
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
                    <Input defaultValue={writing.photo} name="photo" />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Title</FieldLabel>
                    <Input defaultValue={writing.title} name="title" />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Post</FieldLabel>
                    <div className="w-full h-fit mb-[5.2%]">
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        defaultValue={writing.content}
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
                <Button type="submit" size={"lg"} bg={"#828698"} loading={loading}>
                  Post
                </Button>
              </div>
            </form>
          </CustomModal>
        )}

        <h1 className="p-4 md:px-20 text-2xl md:text-3xl">{writing.title}</h1>
        <div className="flex justify-center mt-[2%]">
          <Image
            className="w-auto max-h-[500px] rounded-xl"
            src={writing.photo}
            alt={`title photo for ${writing.title}`}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: safeContent }}
          className="p-3 md:px-40 md:text-xl text-justify indent-5 md:indent-10"
        ></div>
      </main>
    </>
  );
}
