import {
  Avatar,
  Box,
  Text,
  Textarea,
  IconButton,
  Stack,
  Button,
} from "@chakra-ui/react";
import { Comment, Reply } from "../lib/definitions";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import {
  addLike,
  deleteComment,
  editComment,
  getReplies,
  removeLike,
  replyComment,
} from "../lib/actions";
import { useSession } from "next-auth/react";
import { AnimatedBox } from "./animatedBox";
import { useIsAdmin } from "./useIsAdmin";
import { ReplyCard } from "./replyCard";
import { isValidComment } from "../lib/validator";
import { VscClose } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion.create(Box);

export default function CommentCard({
  comment,
  id,
  commentRefresh,
  setLogin,
}: {
  comment: Comment;
  id: number;
  commentRefresh: () => void;
  setLogin: () => void;
}) {
  const { isAdmin } = useIsAdmin();
  const [edit, setEdit] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [liked, setLiked] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replies, setReplies] = useState<Reply[]>([]);
  const { data: session } = useSession();
  const username = session?.user?.name;

  const formattedDate = new Date(comment.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
  );

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      if (typeof session?.user?.name === "string") {
        const alreadyLiked = comment.likes.includes(session?.user?.name);
        if (alreadyLiked) {
          setLiked(true);
        }
      }
    };
    const fetchReplies = async () => {
      const result = await getReplies(id);
      setReplies(result);
    };
    fetchLikes();
    fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentRefresh]);

  useEffect(() => {
    textareaRef.current?.focus();
  });

  const handleLike = async function () {
    if (typeof username === "string") {
      try {
        await addLike(username, id);
        setLiked(true);
        commentRefresh();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("User name is not defined.");
      setLogin();
    }
  };

  const handleUnlike = async function () {
    try {
      if (!username) return;
      await removeLike(id, username);
      setLiked(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async function () {
    try {
      if (!username) return;
      if (username === comment.author || isAdmin) {
        await editComment(id, username, commentBody);
        alert("comment changed");
        setEdit(false);
      }
    } catch (error) {
      console.error(error);
      alert(`There was an error editing your comment: ${error}`);
    } finally {
      commentRefresh();
    }
  };

  const handleReply = async function () {
    try {
      if (!isValidComment(replyBody) || !username) {
        return;
      }
      if (username) {
        await replyComment(id, username, replyBody);
        setReply(false);
        commentRefresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async function () {
    try {
      if (!username) return;
      if (username === comment.author || isAdmin) {
        await deleteComment(id, comment.author);
        setDeleted(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        commentRefresh();
      }, 3000);
    }
  };

  if (deleted) {
    return (
      <div className="border-black border-2 border-solid bg-[#ffffff] p-4 flex flex-wrap relative max-w-[1260px] w-full justify-center items-center">
        Comment deleted
      </div>
    );
  }

  return (
    <Box className="border-black border-2 border-solid bg-[#ffffff] p-4 flex flex-wrap relative max-w-[1260px] w-full">
      <div className="comment-body w-full">
        <div className="absolute top-4 right-4 flex flex-wrap">
          <span className="pr-3">
            {comment.likes.length > 0 && comment.likes.length}
          </span>
          {liked ? (
            <FaHeart
              className="hover:cursor-pointer"
              onClick={() => {
                handleUnlike();
                if (!session) setLogin();
              }}
              size={22}
            />
          ) : (
            <FaRegHeart
              className="hover:cursor-pointer"
              onClick={handleLike}
              size={22}
            />
          )}
        </div>
        <div className="flex items-center">
          <Avatar.Root variant={"solid"} size={"xl"}>
            <Avatar.Fallback name={comment.author}></Avatar.Fallback>
          </Avatar.Root>
          <Text className="px-3 text-xl">{comment.author}</Text>
          <Text className="flex justify-end">{`${formattedDate}`}</Text>
        </div>
        {edit ? (
          <div className="relative">
            <Textarea
              defaultValue={comment.body}
              onChange={(e) => setCommentBody(e.target.value)}
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
          <Text className="text-xl pt-4 pr-4">{comment.body}</Text>
        )}
      </div>
      {showReplies || reply ? (
        <MotionBox className="ml-8 mt-6 w-full">
          <Stack gapY={8}>
            {replies.map((reply) => (
              <ReplyCard key={reply.id} reply={reply}></ReplyCard>
            ))}
            {reply && (
              <AnimatePresence>
                <motion.div
                  className="w-11/12 relative"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                >
                  <Textarea
                    autoresize
                    ref={textareaRef}
                    onChange={(e) => setReplyBody(e.target.value)}
                    className="w-full mt-8 rounded-none pb-[50px] shadow-md"
                    style={{ lineHeight: 1.5 }}
                    variant={"subtle"}
                    placeholder="Start typing..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  ></Textarea>
                  <div className="flex justify-end mt-1 absolute right-0 bottom-3">
                    <Button
                      className="text-xl active:bg-gray-300 px-2 rounded-full"
                      variant={"plain"}
                      onClick={() => setReply(false)}
                    >
                      Cancel
                      <VscClose />
                    </Button>
                    <Button
                      className="text-xl active:bg-gray-300 px-2 rounded-full"
                      variant={"plain"}
                      onClick={handleReply}
                    >
                      Comment
                      <BiCommentDetail />
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </Stack>
        </MotionBox>
      ) : (
        <></>
      )}
      <AnimatedBox
        onEdit={() => setEdit(true)}
        showReplies={() => setShowReplies(true)}
        hideReplies={() => setShowReplies(false)}
        setReply={() => setReply(true)}
        setLogin={setLogin}
        replies={replies}
        replyShown={showReplies}
        onDelete={handleDeleteComment}
        admin={isAdmin}
        author={comment.author}
      ></AnimatedBox>
    </Box>
  );
}
