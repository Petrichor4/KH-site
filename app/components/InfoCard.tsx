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
    <div className="flex md:p-2 justify-around h-1/2 overflow-hidden">
      <div className="w-1/3 h-60 overflow-hidden flex justify-center items-center lg:h-[45vh] border-solid border-black border-2 md:border-4">
        <Image
          className="min-w-full min-h-full sm:max-lg:h-5/6"
          src={image}
          alt="Picture of Kierstyn Hart"
        ></Image>
      </div>
      <Text className="text-justify w-1/2 leading-none text-xl xl:text-3xl">{desc}</Text>
    </div>
  );
}
