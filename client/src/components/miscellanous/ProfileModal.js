import React from "react";
import {
  useDisclosure,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <React.Fragment>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display="flex" icon={<FaEye />} onClick={onOpen} />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent px={5}>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          ></ModalBody>
          <Image
            borderRadius="full"
            boxSize="150px"
            src={user.pic}
            alt={user.name}
          />
          <Text fontSize={{ base: "25px", md: "25px" }} fontFamily="Work sans">
            Email: {user.email}
          </Text>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default ProfileModal;
