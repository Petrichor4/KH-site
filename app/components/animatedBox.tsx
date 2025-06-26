"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LiaReplySolid } from "react-icons/lia";
import { BiSolidPencil, BiSolidTrashAlt } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { BiDotsHorizontal } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { Reply } from "../lib/definitions";

const MotionBox = motion.create(Box);
const MotionIconButton = motion.create(IconButton);

export function AnimatedBox({
  author,
  admin,
  onEdit,
  onDelete,
  showReplies,
  replies,
  hideReplies,
  setReply,
  replyShown,
  setLogin
}: {
  author: string;
  admin: boolean | null;
  onEdit: () => void;
  onDelete: () => void;
  showReplies: () => void;
  replies: Reply[];
  hideReplies: () => void;
  setReply: () => void;
  replyShown: boolean;
  setLogin: () => void;
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
      {/* <div className="flex flex-wrap"> */}
      <MotionIconButton
        variant="plain"
        className="hover:underline active:bg-gray-300 rounded-full duration-100 text-base"
        style={{ paddingInline: "8px" }}
        onClick={() => {setReply(); if (!session) setLogin()}}
      >
        <LiaReplySolid />
        Reply
      </MotionIconButton>
      {replies.length > 0 && (
        <div>
          {replyShown ? (
            <MotionIconButton variant={"plain"} onClick={hideReplies}>
              Hide Replies
              <IoIosArrowDown className="rotate-180" />
            </MotionIconButton>
          ) : (
            <MotionIconButton variant={"plain"} onClick={showReplies}>
              View Replies
              <IoIosArrowDown />
            </MotionIconButton>
          )}
        </div>
      )}
      {admin || usernameMatch() === true ? (
        <div className="flex gap-2 items-center">
          {show && (
            <motion.div>
              {usernameMatch() && (
                <IconButton
                  className="hover:underline active:bg-gray-300 rounded-full duration-100 text-base"
                  style={{ paddingInline: "8px" }}
                  variant={"plain"}
                  onClick={onEdit}
                >
                  <BiSolidPencil />
                  Edit
                </IconButton>
              )}
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
          {admin || usernameMatch() === true ? (
            <BiDotsHorizontal
              className="h-8 w-8 hover:cursor-pointer rounded-full flex justify-center items-center p-[5px] active:bg-gray-300 duration-100"
              onClick={() => setShow((prev) => !prev)}
              size={22}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </MotionBox>
  );
}
