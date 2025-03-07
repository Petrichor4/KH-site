import { Input } from "@chakra-ui/react";

export default function Footer() {
    return (
        <footer className="w-full h-fit text-3xl lg:text-5xl text-center py-20">
            <h3 className="p-4">Join the newsletter:</h3> 
            <Input placeholder="Email" className="w-2/3 md:w-1/3 placeholder-white" />
        </footer>
    )
}