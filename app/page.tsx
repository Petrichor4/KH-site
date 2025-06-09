"use client";
import { Monsieur_La_Doulaise } from "next/font/google";
import Nav from "./components/nav";
import { Image, SimpleGrid } from "@chakra-ui/react";
import InfoCard from "./components/InfoCard";
import { useState, useEffect, FormEvent } from "react";
import { HeaderData, Book } from "./lib/definitions";
import { getBooks, getHeaderData, addBook } from "./lib/actions";
import BookCard from "./components/bookCard";
import { useIsAdmin } from "./components/useIsAdmin";
import { HiOutlinePlus } from "react-icons/hi";
import CustomModal from "./components/customModal";
import { motion } from "framer-motion";
import {
  Button,
  Fieldset,
  Stack,
  Field,
  FieldLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  weight: "400",
  preload: true,
  subsets: ["latin"],
  style: "normal",
  display: "swap"
});

export default function Home() {
  const { isAdmin } = useIsAdmin();
  const [headerData, setHeaderData] = useState<HeaderData[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () =>
        setSize({ width: window.innerWidth, height: window.innerHeight });
      updateSize(); // Set initial size immediately
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  // Prevent rendering until size is determined

  console.log(headerData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getHeaderData();
      if (response) {
        setHeaderData(response);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await getBooks();
      setBooks(response);
    };
    fetchBooks();
  }, []);

  const handleAddBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.currentTarget);
    const photo = formData.get("photo");
    const title = formData.get("title");
    const description = formData.get("description");
    try {
      if (!photo || !title) {
        alert("Please fill everything out Kierstyn!❤️");
        return;
      }
      await addBook(
        title.toString(),
        description?.toString() || "",
        photo.toString()
      );
      const newBook = {
        id: "",
        title: title.toString(),
        description: description?.toString() || "",
        price: "",
        links: [],
        photo: photo.toString(),
      };
      books.push(newBook);
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

  if (headerData.length === 0) return (
  <main className="flex justify-center items-center">
    {/* <Spinner className="h-40 w-40" /> */}
  </main>
);

  return (
    <>
      <motion.header initial={{opacity: 0, scale: 1.2}} animate={{opacity: 1, scale: 1, transition: {duration: .5}}} className="w-full flex flex-wrap justify-center">
        <div className="lg:flex lg:h-screen max-w-[2000px]">
          <div className="lg:w-1/2 lg:h-full lg:flex lg:flex-col justify-around">
            {size && size.width < 1025 && <Nav />}
            <h1
              className={`${monsieurLaDoulaise.className} text-5xl lg:text-7xl xl:text-8xl text-center p-12 pl-4`}
            >
              Kierstyn Hart
            </h1>
            {size && size.width > 1025 && (
              <InfoCard
                image={headerData[0]?.portrait}
                desc={headerData[0]?.about_me}
              />
            )}
          </div>
          <div className={`lg:w-1/2`}>
            <div className="lg:h-full max-md:max-h-[30vh] lg:p-6 overflow-hidden flex justify-center items-end lg:justify-end relative">
              {size && size.width > 1025 && <Nav />}
              <Image
                src={headerData[0]?.hero_image}
                className="lg:h-[95%] min-w-full"
                alt="Photo of desk with various writing accesories"
              />
            </div>
          </div>
        </div>
        {size && size.width < 1025 && (
          <InfoCard
            image={headerData[0]?.portrait}
            desc={headerData[0]?.about_me}
          />
        )}
      </motion.header>
      <main className="mt-4">
        {visible && (
          <CustomModal
            title="New Book"
            isOpen={true}
            onClose={() => setVisible(false)}
          >
            <form onSubmit={handleAddBook}>
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
                    <FieldLabel>Description</FieldLabel>
                    <Textarea name="description" className="h-40"></Textarea>
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
                  Confirm
                </Button>
              </div>
            </form>
          </CustomModal>
        )}
        <h2 className="text-center text-3xl lg:text-5xl p-4">Books</h2>
        <SimpleGrid columns={{ base: 2, lg: 3 }} p={4} className="gap-y-4">
          {books.map((book, index) => (
            <div className="flex justify-center my-2.5" key={index}>
              <BookCard book={book} />
            </div>
          ))}
          {isAdmin && (
            <div className="flex justify-center my-2.5">
              <div className="flex bg-[#6E7281] p-1 md:p-3 rounded-xl active:bg-inherit duration-500 hover:scale-[1.03]">
                <div
                  className="flex justify-center items-center rounded-xl overflow-hidden relative hover:cursor-pointer min-h-[200px] w-[150px] md:h-[300px] md:w-[200px] lg:h-[400px] lg:w-[300px] duration-200 active:bg-[#828698] bg-inherit active:scale-90"
                  onClick={() => setVisible(true)}
                >
                  <HiOutlinePlus size={60} />
                </div>
              </div>
            </div>
          )}
        </SimpleGrid>
      </main>
    </>
  );
}
