import React, { useContext } from 'react'
import { ChatContext } from '../../context/ChatProvider'
import { Box, Text, IconButton } from '@chakra-ui/react'
import { FaArrowLeft } from "react-icons/fa";
import { getSender, getSenderFull } from '../../config/ChatLogics'; 
import ProfileModal from '../miscellanous/ProfileModal';
import UpdateGroupChatModal from '../miscellanous/UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  return (
    <React.Fragment>
        {selectedChat ? (
            <React.Fragment>
                 <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<FaArrowLeft />}
              onClick={() => setSelectedChat("")}
            />
            {
                !selectedChat.isGroupChat ? (
                    <React.Fragment>
                        {getSender(user, selectedChat.users)}
                        <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal 
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        />
                    </React.Fragment>
                )
            }
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          ></Box>
            </React.Fragment>
        ):
            (
                <Box d="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                  Click on a user to start chatting
                </Text>
              </Box>
            )
        }
    </React.Fragment>
  )
}

export default SingleChat