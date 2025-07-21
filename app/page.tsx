"use client";
import { Monsieur_La_Doulaise } from "next/font/google";
import Nav from "./components/nav";
import { Image, Box } from "@chakra-ui/react";
import InfoCard from "./components/InfoCard";
import { useState, useEffect, FormEvent } from "react";
import { Book } from "./lib/definitions";
import { getBooks, addBook } from "./lib/actions";
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
import useHeaderData from "./components/UseHeaderData";
// import { useRouter } from "next/router";

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  weight: "400",
  preload: true,
  subsets: ["latin"],
  style: "normal",
  display: "swap",
});

export default function Home() {

  const MotionBox = motion.create(Box);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const { isAdmin } = useIsAdmin();
  const { headerData, headerLoading } = useHeaderData();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);

  // console.log(headerData);


  useEffect(() => {
    const fetchBooks = async () => {
      const response = await getBooks();
      setBooks(response);
    };
    fetchBooks();
  }, [triggerRefresh]);

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
      setTriggerRefresh(true);

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

  if (headerLoading || !headerData) {
    return <main className="flex justify-center items-center"></main>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.3 } }}
      animate={{ opacity: 1 }}
    >
      <Nav headerData={headerData}></Nav>
      <motion.header
        className="w-full flex flex-wrap justify-center h-[500px] md:h-[900px] lg:h-[81vh]"
      >
        <motion.h1
          className={`${monsieurLaDoulaise.className} text-5xl sm:text-6xl md:text-7xl lg:text-9xl xl:text-[160px] w-full text-center pt-10 pb-20`}
          initial={{ y: 80, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.5, duration: 1 },
          }}
        >
          Kierstyn Hart
        </motion.h1>
        <div className="flex w-11/12 h-full relative border-solid border-2 md:border-4 border-black shadow-2xl">
          <motion.span
            className="h-full w-full bg-gray-800 absolute top-0 left-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, transition: { delay: 1, duration: 0.8 } }}
          ></motion.span>
          <Image
            src={headerData.hero_image}
            alt="Photo of a writing desk belonging to Kierstyn Hart"
            className="w-full max-h-full"
          ></Image>
        </div>
      </motion.header>
      <main className="mt-4 bg-gray-800  text-white flex flex-col">
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
        <span className="h-[200px] md:h-[23.15vh] w-full block"></span>
        <div className="md:w-2/3 self-center mt-16 lg:mt-32">
          <InfoCard
            image={headerData.portrait}
            desc={headerData.about_me}
          ></InfoCard>
        </div>
        <h2 className="flex justify-center items-center text-3xl md:text-4xl lg:text-5xl h-36 lg:h-60">
          Books
        </h2>
        <div className=" w-full flex justify-center mb-16 lg:mb-40">
          <Box
            overflowX="auto"
            whiteSpace="nowrap"
            css={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
            className="carousel flex items-center w-11/12 max-w-[1200px] justify-between"
          >
            {books.map((book, index) => (
              <MotionBox
                key={index}
                as="div"
                display="inline-block"
                mx={2}
                scrollSnapAlign="start"
              >
                <BookCard book={book} onDelete={() => setTriggerRefresh((prev) => !prev)} />
              </MotionBox>
            ))}
            {isAdmin && (
              <MotionBox
                as="div"
                display="inline-block"
                mx={2}
                scrollSnapAlign="start"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex border-solid border-black border-2 justify-center my-2.5 h-[200px] w-[150px] md:h-[300px] md:w-[200px] lg:h-[400px] lg:w-[300px]">
                  <div className="flex p-1 md:p-3 rounded-xl duration-500 hover:scale-[1.03]">
                    <div
                      className="flex justify-center items-center rounded-xl overflow-hidden relative hover:cursor-pointer min-h-[200px] w-[150px] md:h-[300px] md:w-[200px] lg:h-[400px] lg:w-[300px] duration-200 active:scale-90"
                      onClick={() => setVisible(true)}
                    >
                      <HiOutlinePlus size={60} />
                    </div>
                  </div>
                </div>
              </MotionBox>
            )}
          </Box>
        </div>
      </main>
    </motion.div>
  );
}
