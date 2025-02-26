"use client";
import { Image, Text } from "@chakra-ui/react";

export default function InfoCard({
  image,
  desc,
}: {
  image: string;
  desc: string;
}) {
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
