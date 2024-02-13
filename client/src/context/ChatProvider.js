import { createContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([])
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo)

        if(!userInfo) {
            navigate("/")
        } else {
            navigate("/chats")
        }
    }, [location.pathname, navigate])

    return <ChatContext.Provider value={{user, setUser, setSelectedChat, selectedChat, chats, setChats}}>{children}</ChatContext.Provider>
}

export default ChatProvider;