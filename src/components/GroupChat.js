import { Avatar } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import ActiveUser from "../context/ActiveUser";
import RightContent from "../context/rightContent";
import { groupDetailById } from "../loadData/FetchInfo";
import "./chat.css";
import ChatMessageForm from "./ChatMessageForm";
import firebase from 'firebase';
import ChatShow from "./ChatShow";

function GroupChat({ chatId }) {
  // console.log("chatID", chatId);
  const activeUser = useContext(ActiveUser);
  const [chatInfo, setChatInfo] = useState([]);
  const [chatMessage, setChatMessage] = useState([]);
  const { pageRight, changePageRight } = useContext(RightContent);
    const [chatTime, setChatTime] = useState("");

//   console.log("page", pageRight);

  useEffect(() => {

    const getGroupDetails = async () => {
        // console.log("adfadf",chatId)
      const response = await groupDetailById(chatId);
      // console.log("response", response);
      await response.onSnapshot((snapshot) => {
        setChatInfo(snapshot.data());
      });

      await firebase.firestore().collection('Chat').doc(chatId).collection('messages').orderBy('timestamp','desc').onSnapshot((snapshot) =>{
       setChatMessage(
         snapshot.docs.map((doc) => ({
           id: doc.id,
           data: doc.data(),
         }))
       );
      })
    };

    if (activeUser) {
        // console.log(activeUser)
       getGroupDetails();
      // console.log('fine')
    }
     

  }, [chatId]);

  useEffect(() => {
    // console.log('hii')
    const timesetting = () => {
      setChatTime(new Date(chatInfo.lastMessageTime.seconds * 1000).toString());
      // console.log('j')
    };
    if (chatInfo.lastMessageTime) {
      timesetting();
    }
  }, [chatInfo]);

//  console.log("chatMessage", chatMessage);
 const timeNow = new Date(Date.now()).toString().slice(0, 15);
  return (
    <div className="chat">
      <div className="chat__header">
        {chatInfo.groupIcon ? <Avatar src={chatInfo.groupIcon} /> : <Avatar />}

        <div className="chat__header__info">
          <h5>{chatInfo.groupName}</h5>
          <div style={{ fontSize: "14px",display:'flex',alignItems:'center' }}>
            { chatInfo.lastMessage ? `${chatInfo.lastMessage.slice(0,30)}...`: chatInfo.lastMessage}  <span style={{marginLeft:'10px',color:'gray'}}>by</span> <b style={{marginLeft:'10px'}}>{chatInfo.MessageBy}</b>
            {timeNow.slice(0, 15) === chatTime.slice(0, 15) ? (
            chatTime.slice(16, 18) > 12 ? (
              <p
                style={{ marginLeft: "5px", fontSize: "10px", color: "gray" }}
              >
                {`today ${chatTime.slice(16, 18) - 12}:${chatTime.slice(19, 21)} PM `}
              </p>
            ) : (
              <p
                style={{ marginLeft: "5px", fontSize: "10px", color: "gray" }}
              >{`today ${chatTime.slice(16, 18)}:${chatTime.slice(
                19,
                21
              )} AM `}</p>
            )
          ) : (
            <p style={{ marginLeft: "5px", fontSize: "10px", color: "gray" }}>
              {chatTime.slice(4, 15)}
            </p>
          )} 
          </div>
        </div>
      </div>
      <div className="chat__messages">
        {chatMessage.map((msg) =>(
          <ChatShow chat={msg.data} key={msg.id} id={msg.id} chatId={chatId}/>
        ))}
      </div>
      <div className="chat__message__form">
        <ChatMessageForm chatId={chatId} />
      </div>
    </div>
  );
}

export default GroupChat;
