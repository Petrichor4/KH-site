import { Flex, IconButton, Text } from "@chakra-ui/react";
import { HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
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
      <AnimatePresence>
        <motion.div
          className="p-4 rounded-md shadow-lg bg-white max-h-[75%] text-black overflow-auto w-11/12 md:w-9/12 lg:w-2/5"
          initial={{ scale: 0 }}
          transition={{ duration: 0.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <Flex justifyContent="space-between" alignItems="center" mb="4">
            <Text fontSize="4xl" fontWeight="bold">
              {title}
            </Text>
            <IconButton
              size="sm"
              bg={"#828698"}
              _hover={{ bg: "#828698", opacity: "50%" }}
              rounded={"full"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault(); // this will also stop the <Link> from navigating
                onClose();
              }}
            >
              <HiOutlineX />
            </IconButton>
          </Flex>
          {children}
        </motion.div>
      </AnimatePresence>
    </Flex>
  );
};

export default CustomModal;
