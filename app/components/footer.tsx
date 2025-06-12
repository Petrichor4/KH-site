import { Input } from "@chakra-ui/react";

export default function Footer() {
    return (
        <footer className="w-full h-fit text-2xl lg:text-4xl py-16 bg-black flex justify-center items-center">
            <div>
                <h3 className="text-white pt-0 p-4 text-center">Join The Newsletter:</h3>
                <Input placeholder="Email" variant={"subtle"} className="w-2/3 h-12 pb-1 md:w-full text-2xl md:text-3xl" />
            </div>
        </footer>
    )
}