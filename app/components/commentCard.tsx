import { Box, Text } from "@chakra-ui/react";

export default function CommentCard({ comment }: { comment: string }) {
  return (
    <Box className="rounded-lg bg-">
      <Text>{comment}</Text>
    </Box>
  );
}
