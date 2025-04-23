"use client";
import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";
import { VscMenu } from "react-icons/vsc";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Button,
  Fieldset,
  Stack,
  Field,
  FieldLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useIsAdmin } from "./useIsAdmin";
import { editHeaderData } from "../lib/actions";
import CustomModal from "./customModal";

export default function Nav() {
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () =>
        setSize({ width: window.innerWidth, height: window.innerHeight });
      updateSize(); // Set initial size immediately
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  const handleEditHeaderData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const heroPhoto = formData.get("heroPhoto")?.toString();
    const selfie = formData.get("selfie")?.toString();
    const bio = formData.get("bio")?.toString();
    try {
      if (!heroPhoto || !selfie || !bio) {
        alert("Make sure there are no empty values");
        return;
      }
      await editHeaderData(heroPhoto, selfie, bio);
    } catch (error) {
      alert(`Error editing header data: ${error}`);
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
      setVisible(false);
      alert("Sucessfully edited header!");
    }
  };

  // Prevent rendering until size is determined
  if (!size) return null;
  return (
    <nav className="h-0 lg:w-full">
      {size.width >= 1025 ? (
        <div className="flex flex-row absolute top-[3vh] w-[91%] 2xl:w-[95%] justify-between text-2xl">
          <Link href={"/blog"}>
            <h2>Blog</h2>
          </Link>
          <Link href={"/writings"}>
            <h2>Writings</h2>
          </Link>
          <Link href={"/events"}>
            <h2>Events</h2>
          </Link>
          <Link href={"/contact"}>
            <h2>Contact</h2>
          </Link>
          {isAdmin && (
            <button
              className="hover:bg-transparent hover:text-white hover:cursor-pointer"
              onClick={() => setVisible((prev) => !prev)}
            >
              Edit
            </button>
          )}
          {visible && (
            <CustomModal
              title="New Book"
              isOpen={true}
              onClose={() => setVisible((prev) => !prev)}
            >
              <form onSubmit={handleEditHeaderData}>
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
        </div>
      ) : (
        <DrawerRoot size={"lg"}>
          <DrawerBackdrop />
          <DrawerTrigger>
            <VscMenu className="nav-button absolute top-4 right-4" size={30} />
          </DrawerTrigger>
          <DrawerContent bg={"white"}>
            <DrawerCloseTrigger onClick={() => setVisible(false)}/>
            <DrawerHeader>
              <DrawerTitle />
            </DrawerHeader>
            <DrawerBody className="flex justify-center mt-8 text-black flex-col items-center">
              <div className="flex flex-col text-5xl gap-6">
                <Link href={"/blog"} className="active:underline">
                  <h2>Blog</h2>
                </Link>
                <Link
                  href={"/writings"}
                  className="active:underline transition-transform duration-300"
                >
                  <h2>Writings</h2>
                </Link>
                <Link
                  href={"/events"}
                  className="active:underline transition-transform duration-300"
                >
                  <h2>Events</h2>
                </Link>
                <Link
                  href={"/contact"}
                  className="active:underline transition-transform duration-300"
                >
                  <h2>Contact</h2>
                </Link>
                {isAdmin && (
                  <Button
                    onClick={() => setVisible((prev) => !prev)}
                    variant={"ghost"}
                    className="text-black text-5xl active:underline transition-transform duration-300 self-start p-0"
                  >
                    Edit
                  </Button>
                )}
              </div>
              <div className="editContainer w-full py-8">
                {visible && (
                  <form onSubmit={handleEditHeaderData}>
                    <Fieldset.Root>
                      <Stack>
                        <Field.Root>
                          <FieldLabel>Hero Photo</FieldLabel>
                          <Input name="heroPhoto" />
                        </Field.Root>
                        <Field.Root>
                          <FieldLabel>Portrait</FieldLabel>
                          <Input name="selfie" />
                        </Field.Root>
                        <Field.Root>
                          <FieldLabel>Bio</FieldLabel>
                          <Textarea name="bio" className="h-40"></Textarea>
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
                )}
              </div>
            </DrawerBody>
            <DrawerFooter />
          </DrawerContent>
        </DrawerRoot>
      )}
    </nav>
  );
}
