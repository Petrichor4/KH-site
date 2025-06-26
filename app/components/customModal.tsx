import { Flex, Text } from "@chakra-ui/react";
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
        <motion.div className="p-4 shadow-lg bg-white max-h-[75%] max-w-[1150px] w-11/12 md:w-9/12 lg:w-1/2 text-black overflow-auto border-black border-solid border-4 min-h-fit">
          <Flex justifyContent="space-between" alignItems="center" mb="4">
            <Text fontSize="4xl" fontWeight="bold">
              {title}
            </Text>
            <HiOutlineX
              className="hover:bg-gray-300 active:bg-gray-500 h-10 w-10 p-1 rounded-full hover:cursor-pointer duration-200"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault(); // this will also stop the <Link> from navigating
                onClose();
              }}
            />
          </Flex>
          {children}
        </motion.div>
      </AnimatePresence>
    </Flex>
  );
};

export default CustomModal;
