"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LiaReplySolid } from "react-icons/lia";
import { BiSolidPencil, BiSolidTrashAlt } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { BiDotsHorizontal } from "react-icons/bi";
import { useState } from "react";

const MotionBox = motion.create(Box);

export function AnimatedBox({
  author,
  admin,
  onEdit,
  onDelete,
}: {
  author: string;
  admin: boolean | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [show, setShow] = useState(false);
  const { data: session } = useSession();

  const usernameMatch = () => {
    if (author === session?.user?.name) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <MotionBox className="flex flex-wrap gap-2 mt-4 w-full items-center justify-between">
      <IconButton
        variant={"plain"}
        className="hover:underline active:bg-gray-300 rounded-full duration-100 text-base"
        style={{ paddingInline: "8px" }}
      >
        <LiaReplySolid />
        Reply
      </IconButton>
      {admin || usernameMatch() === true ? (
        <div className="flex gap-2 items-center">
          {show && (
            <motion.div>
              { usernameMatch() && (<IconButton
                className="hover:underline active:bg-gray-300 rounded-full duration-100 text-base"
                style={{ paddingInline: "8px" }}
                variant={"plain"}
                onClick={onEdit}
              >
                <BiSolidPencil />
                Edit
              </IconButton>)}
              <IconButton
                className="hover:underline active:bg-gray-300 rounded-full duration-100 text-base"
                style={{ paddingInline: "8px" }}
                variant={"plain"}
                onClick={onDelete}
              >
                <BiSolidTrashAlt />
                Delete
              </IconButton>
            </motion.div>
          )}
          {admin || usernameMatch() === true ? (<BiDotsHorizontal className="h-8 w-8 hover:cursor-pointer rounded-full flex justify-center items-center p-[5px] active:bg-gray-300 duration-100" onClick={() => setShow((prev) => !prev)} size={22} />):(<></>)}
        </div>
      ) : (
        <div></div>
      )}
    </MotionBox>
  );
}
