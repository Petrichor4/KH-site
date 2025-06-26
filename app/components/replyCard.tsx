"use client";
import { Avatar, IconButton, Text, Textarea } from "@chakra-ui/react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { Reply } from "../lib/definitions";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import { deleteReply, editReply } from "../lib/actions";
import { useIsAdmin } from "./useIsAdmin";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  BiDotsHorizontal,
  BiSolidPencil,
  BiSolidTrashAlt,
} from "react-icons/bi";

export function ReplyCard({
  reply,
  commentRefresh,
}: {
  reply: Reply;
  commentRefresh: () => void;
}) {
  const formattedDate = new Date(reply.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const [edit, setEdit] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [show, setShow] = useState(false);
  const { isAdmin } = useIsAdmin();
  const { data: session } = useSession();

  const usernameMatch = () => {
    if (reply.author === session?.user?.name) {
      return true;
    } else {
      return false;
    }
  };

  const handleEdit = async () => {
    try {
      if (session?.user?.name === reply.author)
        await editReply(reply.id, reply.author, replyBody);
      commentRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (session?.user?.name === reply.author || isAdmin) {
        await deleteReply(reply.id, reply.author);
        commentRefresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="reply-body w-full">
      <div className="flex items-center">
        <Avatar.Root variant={"solid"} size={"xl"}>
          <Avatar.Fallback name={reply.author}></Avatar.Fallback>
        </Avatar.Root>
        <Text className="px-3 text-xl">{reply.author}</Text>
        <Text className="flex justify-end">{`${formattedDate}`}</Text>
      </div>
      {edit ? (
        <div className="relative">
          <Textarea
            defaultValue={reply.body}
            onChange={(e) => setReplyBody(e.target.value)}
            className="pr-[80px] lg:pr-[215px]"
          ></Textarea>
          <div className=" absolute right-8 bottom-3 flex gap-2">
            <IconButton
              variant={"plain"}
              onClick={handleEdit}
              className="text-black text-xl hover:underline"
            >
              <IoCheckmarkOutline className="h-8 w-8" />
              Confirm
            </IconButton>
            <IconButton
              variant={"plain"}
              onClick={() => setEdit(false)}
              className="text-black text-xl hover:underline"
            >
              <IoCloseOutline className="h-8 w-8" />
              Cancel
            </IconButton>
          </div>
        </div>
      ) : (
        <Text className="text-xl pt-4 pr-4">{reply.body}</Text>
      )}
      {isAdmin || usernameMatch() === true ? (
        <div className="flex w-full justify-end gap-2 items-center">
          {show && (
            <motion.div>
              {usernameMatch() && (
                <IconButton
                  className="hover:underline active:bg-gray-300 rounded-full duration-100 text-base"
                  style={{ paddingInline: "8px" }}
                  variant={"plain"}
                  onClick={() => setEdit(true)}
                >
                  <BiSolidPencil />
                  Edit
                </IconButton>
              )}
              <IconButton
                className="hover:underline active:bg-gray-300 rounded-full duration-100 text-base"
                style={{ paddingInline: "8px" }}
                variant={"plain"}
                onClick={handleDelete}
              >
                <BiSolidTrashAlt />
                Delete
              </IconButton>
            </motion.div>
          )}
          <BiDotsHorizontal
            className="h-8 w-8 hover:cursor-pointer rounded-full flex justify-center items-center p-[5px] active:bg-gray-300 duration-100"
            onClick={() => setShow((prev) => !prev)}
            size={22}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
