"use client";
import Link from "next/link";
import { useState } from "react";
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
} from "@chakra-ui/react";
import { useIsAdmin } from "./useIsAdmin";
import CustomModal from "./customModal";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginModal } from "./loginModal";
import HeaderForm from "./HeaderForm";
import { HeaderData } from "../lib/definitions";

export default function Nav({headerData}:{headerData: HeaderData | undefined}) {
  // interface Photos {
  //   id: string
  // }

  const [visible, setVisible] = useState(false);
  const [login, setLogin] = useState(false);
  const { data: session } = useSession();
  const { isAdmin } = useIsAdmin();


  return (
    <nav className="w-full flex justify-end pt-5 pr-3 lg:p-0 lg:justify-center">
      <div className="lg:flex flex-row w-2/5 max-w-[665px] justify-between items-center text-2xl xl:text-4xl hidden h-40">
        <Link className="hover:underline relative inline-block" href={"/blog"}>
          <h2 className="z-10">Blog</h2>
          {/* <motion.span className="h-[2px] w-[45px] z-0 absolute bottom-[2px] bg-black"></motion.span> */}
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
            className="hover:underline hover:cursor-pointer"
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
            <HeaderForm
              headerData={headerData}
            />{" "}
          </CustomModal>
        )}
      </div>
      <DrawerRoot size={"lg"}>
        <DrawerBackdrop />
        <DrawerTrigger>
          <VscMenu className="nav-button lg:hidden m-[5px]" size={30} />
        </DrawerTrigger>
        <DrawerContent bg={"white"}>
          <DrawerCloseTrigger onClick={() => setVisible(false)} />
          <DrawerHeader>
            <DrawerTitle />
          </DrawerHeader>
          <DrawerBody className="flex mt-8 text-black flex-col items-center">
            {login && <LoginModal onClose={() => setLogin(false)}></LoginModal>}
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
              {session ? (
                <Button
                  className="navButton text-black text-5xl active:underline transition-transform duration-300 self-start p-0"
                  variant={"plain"}
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              ) : (
                <div>
                  <Button
                    className="navButton text-black text-5xl active:underline transition-transform duration-300 self-start p-0"
                    variant={"plain"}
                    onClick={() => setLogin(true)}
                  >
                    Sign In
                  </Button>
                </div>
              )}
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
                  <HeaderForm
                    headerData={headerData}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </DrawerRoot>
    </nav>
  );
}
