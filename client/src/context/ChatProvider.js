import { createContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from "socket.io-client";

export const ChatContext = createContext();

var socket;

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        socket = io(process.env.REACT_APP_API_URL_DEV);
        socket.on("connection", () => setSocketConnected(true));
      }, []);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo)

        if(!userInfo) {
            navigate("/")
        } else {
            navigate("/chats")
        }
    }, [location.pathname, navigate])

    return <ChatContext.Provider value={{user, setUser, setSelectedChat, selectedChat, chats, setChats, notification, setNotification, socketConnected, setSocketConnected, socket}}>{children}</ChatContext.Provider>
}

export default ChatProvider;