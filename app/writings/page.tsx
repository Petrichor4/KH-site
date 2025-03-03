'use client'
import Link from "next/link";
import { HiArrowLeft, HiMiniPencilSquare } from "react-icons/hi2";
import { IconButton, Button } from "@chakra-ui/react";
import { signOut,useSession } from "next-auth/react";
import Masonry,{ ResponsiveMasonry } from "react-responsive-masonry";
import CustomCard from "../components/customCard";
import { Writing } from "../lib/definitions";
import { useState, useEffect } from "react";
import { getWritings } from "../lib/actions";


export default function Writings() {

    const [writings, setWritings] = useState<Writing[]>([]);
    const { data: session } = useSession();
    const [visibile, setVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchWritings = async() => {
            const result = await getWritings();
            setWritings(result)
        }
        fetchWritings();
    },[])

    return (
        <>
          <nav className="p-8 flex justify-center">
            <Link href="/" className="active:border-none absolute top-4 left-4">
              <HiArrowLeft size={40} />
            </Link>
            <h1 className="text-5xl">Writings</h1>
            <Link className="absolute top-4 right-4" href={"/login"}>{session ? ( <Button className="text-xl" variant={"ghost"} onClick={() => signOut()}>Sign Out</Button>): (<Button className="text-xl" variant={"ghost"}>Sign In/ Sign Up</Button>)}</Link>
          </nav>
          <main>
            {isAdmin && (
              <IconButton
                variant={"outline"}
                className="active:scale-95"
                m={3}
                p={3}
                onClick={() => setVisible(true)}
              >
                New Post
                <HiMiniPencilSquare />
              </IconButton>
            )}
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                500: 2,
                768: 3,
                1100: 4,
                1500: 5,
                2000: 6,
              }}
            >
              <Masonry className="p-[1%] pt-0">
                {writings.map((writing, index) => (
                  <CustomCard key={index} post={writing} type="writings" />
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </main>
        </>
      );
}