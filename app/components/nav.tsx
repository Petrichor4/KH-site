"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
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

export default function Nav() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="absolute top-4 right-4">
      {size.width >= 768 ? (
        <div className="">
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
        </div>
      ) : (
        <DrawerRoot size={"lg"}>
          <DrawerBackdrop />
          <DrawerTrigger>
            <VscMenu size={30} />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerCloseTrigger />
            <DrawerHeader>
              <DrawerTitle />
            </DrawerHeader>
            <DrawerBody className="flex justify-center mt-8">
              <div className="flex flex-col text-5xl gap-6">
                <Link href={"/"} className="active:underline">
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
              </div>
            </DrawerBody>
            <DrawerFooter />
          </DrawerContent>
        </DrawerRoot>
      )}
    </nav>
  );
}
