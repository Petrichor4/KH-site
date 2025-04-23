'use client'

import {
    Button,
    Stack,
    Input,
    Textarea,
  } from "@chakra-ui/react";
  import Link from "next/link";
  import { HiArrowLeft} from "react-icons/hi2"
//   import { useState } from "react";
  

export default function ContactPage() {

    // const [loading, setLoading] = useState(false);

    // const handleSubmitContact = async() => {

    // }

  return (
    <>
      <main className="flex justify-center items-center flex-wrap md:flex-nowrap">
      <Link href="/" className="active:border-none absolute top-4 left-4">
          <HiArrowLeft size={40} />
        </Link>
        <div className="w-5/6 md:w-1/2">
            <Stack className="p-2">
                <h2>Name</h2>
                <Input variant={'subtle'} bg={'white'} color={'black'} size={'lg'}></Input>
                <h2>Email</h2>
                <Input variant={'subtle'} bg={'white'} color={'black'} size={'lg'}></Input>
                <h2>Message</h2>
                <Textarea variant={'subtle'} bg={'white'} color={'black'} size={'lg'}></Textarea>
                <Button className="text-black">Submit</Button>
            </Stack>
        </div>
        <div className="w-1/2"></div>
      </main>
    </>
  );
}