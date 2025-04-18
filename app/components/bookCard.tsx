import { Image } from "@chakra-ui/react";
import { Book } from "../lib/definitions";
import { HiOutlinePencil } from "react-icons/hi";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { deleteBook, editBook } from "../lib/actions";
import CustomModal from "@/app/components/customModal";
import { useIsAdmin } from "./useIsAdmin";
import {
  Button,
  Fieldset,
  Stack,
  Field,
  FieldLabel,
  Input,
  Textarea
} from "@chakra-ui/react";

export default function BookCard({ book }: { book: Book }) {
  const { isAdmin } = useIsAdmin();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log(isAdmin)

  const handleEditBook = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const photo = formData.get("photo");
    const title = formData.get("title");
    const description = formData.get("description");
    try {
      if (!photo || !title) {
        alert("Please fill everything out Kierstyn!❤️");
        return;
      }
      await editBook(
        book.id,
        title.toString(),
        description?.toString() || "",
        photo.toString()
      );
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

  const handleDeleteBook = async() => {
    try {
      await deleteBook(book.id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      {visible && (
        <CustomModal
          title="Edit Book"
          isOpen={true}
          onClose={() => setVisible(false)}
        >
          <form onSubmit={handleEditBook}>
            <Fieldset.Root>
              <Stack>
                <Field.Root>
                  <FieldLabel>Photo</FieldLabel>
                  <Input defaultValue={book.photo} name="photo" />
                </Field.Root>
                <Field.Root>
                  <FieldLabel>Title</FieldLabel>
                  <Input defaultValue={book?.title} name="title" />
                </Field.Root>
                <Field.Root>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    defaultValue={book?.description || ""}
                    name="description"
                    className="h-40"
                  ></Textarea>
                </Field.Root>
              </Stack>
            </Fieldset.Root>
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                bg={"#828698"}
                size={"lg"}
                loading={loading}
                onClick={() => handleDeleteBook()}
              >
                Delete
              </Button>
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
      <Link
        href={`/book/${book.id}`}
        className="flex flex-col bg-[#6E7281] p-1 md:p-3 rounded-xl active:bg-inherit duration-200"
      >
        <div className="flex justify-center items-center rounded-t-xl overflow-hidden relative hover:cursor-pointer h-[200px] w-[150px] md:h-[300px] md:w-[200px] lg:h-[400px] lg:w-[300px] duration-300">
          <Image
            className="min-h-full relative"
            src={book.photo}
            alt={`photo of ${book.photo}`}
          />
          {isAdmin && (
            <HiOutlinePencil
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setVisible(true);
              }}
              size={30}
              className="absolute bottom-4 right-4"
            />
          )}
        </div>
        <h2 className="p-1 md:pt-3 text-center md:text-xl lg:text-3xl rounded-b-xl h-fit w-inherit">{`${book.title}`}</h2>
      </Link>
    </div>
  );
}
