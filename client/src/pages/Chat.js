import React from "react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellanous/SideDrawer";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";

const Chat = () => {
  const { user } = useContext(ChatContext);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer user={user} />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && (
          <React.Fragment>
            <MyChats />
            <ChatBox />
          </React.Fragment>
        )}
      </Box>
    </div>
  );
};

export default Chat;
