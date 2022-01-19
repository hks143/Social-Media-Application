import React, { useEffect, useState, useRef } from 'react'
// import socketIo from "socket.io-client";
import "./Chat.css";
import Button from '@material-ui/core/Button';
import Message from '../Message/Message';
import Typography from '@material-ui/core/Typography';
import ReactScrollToBottom from "react-scroll-to-bottom";
import { useParams, useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client'
import { AddNotification, FindNotification, ClearNotification, SendMailToUser, FindUserForChat, GetDirectMessage, createMessage } from '../../actions/direct';
import Navbar from '../Navbar/Navbar';
import { Paper } from '@material-ui/core';
const initial = { sender: '', receiver: '', createdAt: Date.now(), text: '' }
const Chat = () => {
    const { p } = useSelector((state) => state);
    const user = JSON.parse(localStorage.getItem('profile'));
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState('');
    const [sent, setSent] = useState(false);
    const [online, setOnline] = useState(false)
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [typing, setTyping] = useState(false);
    const { id } = useParams();
    const [username, setUsername] = useState("QuickShare");
    const dispatch = useDispatch();
    const history = useHistory();
    const socket = useRef();

    const conversationId = (String(user?.result?.googleId || (user?.result?._id)) > String(id) ?
        (`${String(user?.result?.googleId || (user?.result?._id))}-${id}`) :
        ((`${id}-${String(user?.result?.googleId || (user?.result?._id))}`)));

    // console.log(p);
    useEffect(async () => {
        // console.log(conversationId);
        const data = await dispatch(GetDirectMessage({ conversationId: conversationId, senderId: (user?.result?.googleId || user?.result?._id) }));

        setMessages(...messages, data);
        // setMessages((prev) => [...prev, data]);

    }, []);

    useEffect(async () => {
        if (user?.result?.googleId === id || (user?.result?._id === id)) {
            history.push('/');
        }
        else if (!user) {
            history.push('/auth');
        }
        socket.current = io("https://socketioprojectchatappp.herokuapp.com/");
        socket?.current?.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
                receiver: data.receiverId
            })
        })
        if (user) {
            const Name = await dispatch(FindUserForChat({ id: id }, history));
            // console.log(Name);

            if (Name) {
                setUsername(Name.name);
            }
        }
        socket?.current?.on("TypingReceive", (IsTyping) => {
            setTyping(IsTyping);
        })

    }, []);

    useEffect(() => {
        (arrivalMessage && (arrivalMessage?.sender === id) && (user?.result?.googleId === arrivalMessage?.receiver || (user?.result?._id === arrivalMessage?.receiver)) && setMessages((prev) => [...prev, arrivalMessage]));
    }, [arrivalMessage])

    useEffect(() => {
        socket?.current?.emit("addUser", (user?.result?.googleId || user?.result?._id));
        socket?.current?.on("getUsers", (users) => {
            const onlineCheck = users.some((user) => user.userId === id);
            setOnline(onlineCheck);
        });
    }, [user]);

    useEffect(() => {
        if (msg) {
            socket?.current?.emit("TypingSend", { id: id, temp: true });

        }
        else {
            socket?.current?.emit("TypingSend", { id: id, temp: false });

        }
    }, [msg])
    const f = () => {
        const temp = document.getElementById('chatInput').value;

        setMsg(temp);
        // console.log(msg);
    }
    const send = () => {

        const message = document.getElementById('chatInput').value;
        const shouldSent = !(!message?.length || ((!message || /^\s*$/.test(message))))
        const conversationId = (String(user?.result?.googleId || (user?.result?._id)) > String(id) ?
            (`${String(user?.result?.googleId || (user?.result?._id))}-${id}`) :
            ((`${id}-${String(user?.result?.googleId || (user?.result?._id))}`)));

        if (message && (shouldSent)) {
            const sms = {
                sender: (user?.result?.googleId || user?.result?._id),
                text: message,
                createdAt: Date.now(),
                receiver: id,
                conversationId: conversationId,
                seen: online

            }
            const smss = {
                sender: (user?.result?.googleId || user?.result?._id),
                text: message,
                receiver: id,
                conversationId: conversationId,
                seen: online
            }
            socket?.current?.emit("TypingSend", { id: id, temp: false });

            setMessages((prev) => [...prev, sms]);
            dispatch(createMessage(smss));
            socket?.current?.emit("sendMessage", {
                senderId: (user?.result?.googleId || user?.result?._id),
                receiverId: id,
                text: message

            });

            if (!sent && !online) {
                setSent(true);
                dispatch(SendMailToUser({ id: id, senderId: (user?.result?.googleId || user?.result?._id), message: message, Name: user?.result?.name }))
                dispatch(AddNotification({ id: id, data: `${user?.result?.name} sent you a #message#https://hemant-sahu.netlify.app/direct/${(user?.result?.googleId || user?.result?._id)}`, seen: false }))
            }
            document.getElementById('chatInput').value = "";


        }
    }

    // console.log(messages);
    // console.log(typing);
    return (
        <>
            <Navbar />
            <div className="chatPage">
                <div className="chatContainer">
                   <Paper elevation={7}>

                        <Button variant='text' onClick={()=>{history.push(`/profile/${id}`)}}>

                            <h3>{`${username} `}</h3>
                            {
                                ((online && typing) ?
                                    (<h6>Typing....</h6>)
                                    :
                                    ((online) && (<h6>Online</h6>))
                                )
                            }
                        </Button>
                   </Paper>
                    
                    {
                        ((!messages) ? (<h1>No messages yet</h1>) : (
                            <ReactScrollToBottom className="chatBox">

                                {messages?.map((item, i) =>

                                    <Message seen={item.seen && (item.sender === (user?.result?._id) || item.sender === (user?.result?.googleId))} time={item.createdAt} message={item.text} classs={(item.sender === (user?.result?._id) || item.sender === (user?.result?.googleId)) ? 'right' : 'left'} />



                                )}

                            </ReactScrollToBottom>
                        ))
                    }

                    <div className="inputBox">
                        <input onChange={f} onKeyPress={(event) => event.key === 'Enter' ? send() : null} type="text" id="chatInput" />
                        <button onClick={send} className="sendBtn"><SendIcon fontSize="large" /></button>
                    </div>
                </div>

            </div>
        </>

    )
}

export default Chat
