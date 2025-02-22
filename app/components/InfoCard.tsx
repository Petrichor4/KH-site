"use client";
import { Image, Text } from "@chakra-ui/react";
import { useState, useEffect } from 'react';

export default function InfoCard({
  image,
  desc,
}: {
  image: string;
  desc: string;
}) {
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
        updateSize(); // Set initial size immediately
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
      }
    }, []);
  
    // Prevent rendering until size is determined
    if (!size) return null;
  
  return (
    <div className="flex p-2 pt-6 justify-around">
      <div className="w-1/3 overflow-hidden flex justify-center items-center">
        <Image
          className="w-full h-full"
          src={image}
          alt="Picture of Kierstyn Hart"
        ></Image>
      </div>
      <Text className="text-justify w-1/2 leading-none">{desc}</Text>
    </div>
  );
}
