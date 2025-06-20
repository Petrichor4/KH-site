import { Avatar, Box, Text, Textarea, IconButton } from "@chakra-ui/react";
import { Comment } from "../lib/definitions";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { addLike, deleteComment, editComment, removeLike } from "../lib/actions";
import { useSession } from "next-auth/react";
import { AnimatedBox } from "./animatedBox";
import { useIsAdmin } from "./useIsAdmin";

export default function CommentCard({
  comment,
  id,
  commentRefresh
}: {
  comment: Comment;
  id: number;
  commentRefresh: () => void;
}) {
  // const motionBox = motion(Box)
  const { isAdmin } = useIsAdmin();
  const [edit, setEdit] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [liked, setLiked] = useState(false);
  const [deleted, setDeleted] = useState(false);
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

  useEffect(() => {
    const fetchLikes = async () => {
      if (typeof session?.user?.name === "string") {
        const alreadyLiked = comment.likes.includes(session?.user?.name);
        if (alreadyLiked) {
          setLiked(true);
        }
      }
    };
    fetchLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = async function () {
    if (typeof session?.user?.name === "string") {
      try {
        await addLike(session.user.name, id);
        setLiked(true);
        commentRefresh();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("User name is not defined.");
    }
  };

  const handleUnlike = async function   () {
    try {
      await removeLike(id, username || "")
    } catch (error) {
      console.error(error)
    } finally {
      setLiked(false);
      commentRefresh();
    }
  }

  const handleEdit = async function () {
    try {
      await editComment(id, session?.user?.name || "", commentBody);
      alert("comment changed");
      setEdit(false);
    } catch (error) {
      console.error(error);
      alert(`There was an error editing your comment: ${error}`);
    } finally {
      commentRefresh();
    }
  };

    const handleDelete = async function () {
    try {
      await deleteComment(id, session?.user?.name || "")
      setDeleted(true);
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        commentRefresh()
      }, 3000);
    }
  }


  if (deleted) {
    return (
      <div className="border-black border-2 border-solid bg-[#ffffff] p-4 flex flex-wrap relative max-w-[1260px] w-full justify-center items-center">Comment deleted</div>
    )
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
        <AnimatedBox
          onEdit={() => setEdit(true)}
          onDelete={handleDelete}
          admin={isAdmin}
          author={comment.author}
        ></AnimatedBox>
      </div>
    </Box>
  );
}
