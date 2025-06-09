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
  IconButton,
} from "@chakra-ui/react";
import { useIsAdmin } from "./useIsAdmin";
import { editHeaderData } from "../lib/actions";
import CustomModal from "./customModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { LuImagePlus } from "react-icons/lu";

export default function Nav() {

  // interface Photos {
  //   id: string
  // }

  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useIsAdmin();
  const [photos, setPhotos] = useState([])

  useEffect(()=> {
    try {
      setPhotos(JSON.parse(localStorage.getItem("uploadedImages") || ''))
    } catch (error) {
      console.log(`error getting photos from localstorage: ${error}`)
    }
  },[])
  console.log(photos)

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
      alert("Sucessfully edited header!");
      setVisible(false);
    } catch (error) {
      alert(`Error editing header data: ${error}`);
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (publicId: string) => {
    const storedImages = JSON.parse(
      localStorage.getItem("uploadedImages") || "[]"
    );
    const updatedImages = [...storedImages, publicId];

    // Update the context and localStorage
    localStorage.setItem("uploadedImages", JSON.stringify(updatedImages));
  };

  // Prevent rendering until size is determined
  if (!size) return null;
  return (
    <nav className="h-0 lg:w-full">
      {size.width >= 1025 ? (
        <div className="flex flex-row absolute top-[3vh] w-[91%] 2xl:w-[95%] justify-between text-2xl">
          <Link className="hover:underline" href={"/blog"}>
            <h2>Blog</h2>
          </Link>
          <Link className="hover:underline" href={"/writings"}>
            <h2>Writings</h2>
          </Link>
          <Link className="hover:underline" href={"/events"}>
            <h2>Events</h2>
          </Link>
          <Link className="hover:underline" href={"/contact"}>
            <h2>Contact</h2>
          </Link>
          {isAdmin && (
            <button
              className="hover:underline hover:bg-transparent hover:text-white hover:cursor-pointer"
              onClick={() => setVisible((prev) => !prev)}
            >
              Edit
            </button>
          )}
          {visible && (
            <CustomModal
              title="Edit Header"
              isOpen={true}
              onClose={() => setVisible((prev) => !prev)}
            >
              <form onSubmit={handleEditHeaderData}>
                <Fieldset.Root>
                  <Stack>
                    <CldUploadWidget
                      // Cloudinary upload preset
                      uploadPreset="ml_default"
                      // What options show up in the widget
                      options={{
                        sources: [
                          "local",
                          "url",
                          "camera",
                          "google_drive",
                          "dropbox",
                        ],
                        styles: { container: "cloudinary-widget" },
                      }}
                      // What to do with the upload results
                      onSuccess={(results: CloudinaryUploadWidgetResults) => {
                        if (
                          typeof results.info === "object" &&
                          results.info?.public_id
                        ) {
                          handleUploadSuccess(results.info.public_id);
                        } else {
                          console.error("Invalid upload results:", results);
                        }
                      }}
                    >
                      {({ open }) => (
                        <div>
                          <IconButton
                            p={3}
                            className="hidden md:flex mx-3 hover:cursor-pointer active:scale-[.95] justify-center items-center"
                            onClick={() => open()}
                          >
                            Upload Image
                          </IconButton>
                          <IconButton
                            className="md:hidden rounded-full"
                            onClick={() => open()}
                          >
                            <LuImagePlus />
                          </IconButton>
                        </div>
                      )}
                    </CldUploadWidget>

                    <Field.Root>
                      <FieldLabel>Hero Photo</FieldLabel>
                      <Input name="heroPhoto" type="text" list="photos"/>
                      <datalist id="photos">
                        {photos.map((photo: string, index: number) => (
                          <option key={index}>{photo}</option>
                        ))}
                      </datalist>
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
                    _hover={{ opacity: "50%" }}
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
            <DrawerCloseTrigger onClick={() => setVisible(false)} />
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
                    className="navButton text-black text-5xl active:underline transition-transform duration-300 self-start p-0"
                  >
                    Edit
                  </Button>
                )}
              </div>
              <AnimatePresence initial={false}>
                {visible && (
                  <motion.div
                    className="editContainer w-full py-8"
                    transition={{ duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
                    initial={{ y: -20, opacity: 0, height: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0, height: 0 }}
                  >
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
                          _hover={{ opacity: "50%" }}
                          size={"lg"}
                          loading={loading}
                        >
                          Confirm
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </DrawerBody>
            <DrawerFooter />
          </DrawerContent>
        </DrawerRoot>
      )}
    </nav>
  );
}
