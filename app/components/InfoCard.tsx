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
    <div className="flex p-2 justify-around h-1/2 overflow-hidden">
      <div className="w-1/3 overflow-hidden flex justify-center items-center lg:h-[55vh]">
        <Image
          className="min-w-full min-h-full sm:max-lg:h-5/6"
          src={image}
          alt="Picture of Kierstyn Hart"
        ></Image>
      </div>
      <Text className="text-justify w-1/2 leading-none md:text-xl xl:text-2xl">{desc}</Text>
    </div>
  );
}
