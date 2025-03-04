import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { HiOutlineX } from "react-icons/hi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      justifyContent="center"
      alignItems="center"
      zIndex="1000"
    >
      <Box
        padding="4"
        borderRadius="md"
        boxShadow="lg"
        backgroundColor={"Window"}
        maxH={'75%'}
        width={{ base: "90%", md: "70%" }}
        className="modal"
        color={'WindowText'}
        overflow={"auto"}
      >
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Text fontSize="xl" fontWeight="bold">{title}</Text>
          <IconButton size="sm" bg={"#828698"} rounded={"full"} onClick={onClose}><HiOutlineX /></IconButton>
        </Flex>
        {children}
      </Box>
    </Flex>
  );
};

export default CustomModal;
