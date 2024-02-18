import React, { useContext, useState, useEffect } from 'react'
import { ChatContext } from '../../context/ChatProvider'
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from '@chakra-ui/react'
import { FaArrowLeft } from "react-icons/fa";
import { getSender, getSenderFull } from '../../config/ChatLogics'; 
import ProfileModal from '../miscellanous/ProfileModal';
import UpdateGroupChatModal from '../miscellanous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from "../../animations/typing.json";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_API_URL_DEV)
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [])

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  console.log(notification)

  useEffect(() => {
    socket.on('message recieved', (newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if(!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  })

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL_DEV}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if(!selectedChat) return

    try {
      setLoading(true)
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL_DEV}/api/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    }catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  } 

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
                        fetchMessages={fetchMessages}
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
          >
             {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
 <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
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