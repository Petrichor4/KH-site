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
  display: "swap",
});

export default function Home() {
  const { isAdmin } = useIsAdmin();
  const [headerData, setHeaderData] = useState<HeaderData[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  // const [size, setSize] = useState<{ width: number; height: number } | null>(
  //   null
  // );

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const updateSize = () =>
  //       setSize({ width: window.innerWidth, height: window.innerHeight });
  //     updateSize(); // Set initial size immediately
  //     window.addEventListener("resize", updateSize);
  //     return () => window.removeEventListener("resize", updateSize);
  //   }
  // }, []);

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

  if (headerData.length === 0)
    return (
      <main className="flex justify-center items-center">
        {/* <Spinner className="h-40 w-40" /> */}
      </main>
    );

  return (
    <motion.div initial={{ opacity: 0, transition: {duration: .3}}} animate={{opacity: 1}}>
      <Nav></Nav>
      <motion.header
        // initial={{ opacity: 0, scale: 1.2 }}
        // animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
        className="w-full flex flex-wrap justify-center h-[81vh]"
      >
        <motion.h1
          className={`${monsieurLaDoulaise.className} text-5xl sm:text-6xl md:text-7xl lg:text-9xl xl:text-[160px] p-12 py-20 pl-6`}
          initial={{ y: 80, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.5, duration: 1 },
          }}
        >
          Kierstyn Hart
        </motion.h1>
        <div
          className="flex w-11/12 h-full relative"
          style={{ border: "4px solid black" }}
        >
          <motion.span className="h-full w-full bg-gray-800 absolute top-0 left-0" initial={{opacity: 1}} animate={{opacity:0, transition: {delay: 1, duration: 0.8}}}></motion.span>
          <Image
            src={headerData[0].hero_image}
            alt="Photo of a writing desk belonging to Kierstyn Hart"
            className="w-full"
          ></Image>
        </div>
      </motion.header>
      <main className="mt-4 bg-slate-400 flex flex-wrap flex-col">
        {visible && (
          <CustomModal
            title="New Book"
            isOpen={true}
            onClose={() => setVisible(false)}
          >
            <form
              onSubmit={handleAddBook}
              className="flex justify-between flex-col"
            >
              <Fieldset.Root>
                <Stack>
                  <Field.Root>
                    <FieldLabel>Photo</FieldLabel>
                    <Input name="photo" variant={"subtle"} />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Title</FieldLabel>
                    <Input name="title" variant={"subtle"} />
                  </Field.Root>
                  <Field.Root>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      name="description"
                      className="h-40"
                      variant={"subtle"}
                    ></Textarea>
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
        <span className="h-[23.15vh] w-full block"></span>
        <div className="w-2/3 self-center mt-32">
          <InfoCard image={headerData[0].portrait} desc={headerData[0].about_me}></InfoCard>
        </div>
        <h2 className="flex justify-center items-center text-3xl md:text-4xl lg:text-5xl p-4 mt-4 h-20 md:h-36 lg:h-60">
          Books
        </h2>
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
    </motion.div>
  );
}
