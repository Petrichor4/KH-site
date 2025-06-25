"use client";
import { Avatar, Text } from "@chakra-ui/react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { Reply } from "../lib/definitions";

export function ReplyCard({ reply }: { reply: Reply }) {
  const formattedDate = new Date(reply.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <div className="reply-body w-full">
      {/* <div className="absolute top-4 right-4 flex flex-wrap">
        <span className="pr-3">
          {reply.likes.length > 0 && reply.likes.length}
        </span>
        {liked ? (
          <FaHeart
            className="hover:cursor-pointer"
            onClick={handleUnlike}
            size={22}
          />
        ) : (
          <FaRegHeart
            className="hover:cursor-pointer"
            onClick={handleLike}
            size={22}
          />
        )}
      </div> */}
      <div className="flex items-center">
        <Avatar.Root variant={"solid"} size={"xl"}>
          <Avatar.Fallback name={reply.author}></Avatar.Fallback>
        </Avatar.Root>
        <Text className="px-3 text-xl">{reply.author}</Text>
        <Text className="flex justify-end">{`${formattedDate}`}</Text>
      </div>
      {/* {edit ? (
        <div className="relative">
          <Textarea
            defaultValue={reply.body}
            onChange={(e) => setreplyBody(e.target.value)}
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
      ) : ( */}
      <Text className="text-xl pt-4 pr-4">{reply.body}</Text>
      {/* )} */}
      {/* {reply && (
        <div className="flex flex-wrap justify-center">
          <Textarea
            ref={textareaRef}
            onChange={(e) => setReplyBody(e.target.value)}
            className="w-11/12 mt-8"
          ></Textarea>
          <div className="flex w-11/12 justify-end mt-1 gap-2">
            <Button className="text-xl" onClick={() => setReply(false)}>
              Cancel
            </Button>
            <Button className="text-xl" onClick={handleReply}>
              reply
            </Button>
          </div>
        </div>
      )} */}
    </div>
  );
}
