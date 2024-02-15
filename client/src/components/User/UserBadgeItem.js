import { Badge } from "@chakra-ui/layout";
import { FaTimes } from "react-icons/fa";
import { Text } from "@chakra-ui/react";
 
const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
      display='flex'
      alignItems='center'
    >
      <Text mr={4}>{user.name}</Text>
      {/* {admin === user._id && <span> (Admin)</span>} */}
      <FaTimes/>
    </Badge>
  );
};

export default UserBadgeItem;