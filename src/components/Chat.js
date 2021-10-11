import { Avatar } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import ActiveUser from "../context/ActiveUser";
// import RightContent from "../context/rightContent";
import { groupDetailById } from "../loadData/FetchInfo";
import "./chat.css";
import ChatMessageForm from "./ChatMessageForm";
import ChatShow from "./ChatShow";
import firebase from "firebase";

function Chat({ chatId }) {
  // console.log("chatID", chatId);
  const activeUser = useContext(ActiveUser);
  const [chatInfo, setChatInfo] = useState([]);
  const [chatMessage, setChatMessage] = useState([]);
  // const { pageRight, changePageRight } = useContext(RightContent);
  const [chatTime, setChatTime] = useState("");
  // console.log("page", pageRight);
  // const [chatDate, setChatData] = useState(false);

  useEffect(() => {
    // console.log("hii");+
    const getGroupDetails = async () => {
      const response = await groupDetailById(chatId);
      // console.log("response", response);
      firebase
        .firestore()
        .collection("Chat")
        .doc(chatId)
        .onSnapshot((snapshot) => {
          setChatInfo(snapshot.data());
        });

      firebase
        .firestore()
        .collection("Chat")
        .doc(chatId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setChatMessage(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    };

    if (activeUser) {
      getGroupDetails();
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

  // console.log("indo", chatInfo.photo1Url);
  // console.log("indo", chatInfo.photo2Url);
  // console.log("chatMessage",chatMessage)
  const timeNow = new Date(Date.now()).toString().slice(0, 15);
  // console.log(new Date(chatInfo.lastMessageTime.seconds * 1000).toString())
  // console.log(chatTime)

  // const ShowGroupDetials = () =>{
  //   setChatData(true)
  // }
  return (
    <div className="chat">
      <div className="chat__header">
        {chatInfo.photo1Url === activeUser.photoUrl ? (
          <Avatar src={chatInfo.photo2Url} />
        ) : (
          <Avatar src={chatInfo.photo1Url} />
        )}

        <div className="chat__header__info">
          <h5>
            {chatInfo.user1Name === activeUser.username
              ? chatInfo.user2Name
              : chatInfo.user1Name}
            {/* <span
              style={{ marginLeft: "30px", cursor: "pointer", color: "red" }}
              onClick={ShowGroupDetials}
            >
              Details...
            </span> */}
          </h5>

          <div
            style={{ fontSize: "14px", display: "flex", alignItems: "center" }}
          >
            {chatInfo.lastMessage
              ? `${chatInfo.lastMessage.slice(0, 30)}...`
              : chatInfo.lastMessage}{" "}
            <span style={{ color: "gray", marginLeft: "10px" }}>by</span>{" "}
            <b style={{ marginLeft: "10px" }}>{chatInfo.MessageBy}</b>
            {timeNow.slice(0, 15) === chatTime.slice(0, 15) ? (
              chatTime.slice(16, 18) > 12 ? (
                <p
                  style={{ marginLeft: "5px", fontSize: "10px", color: "gray" }}
                >
                  {`today ${chatTime.slice(16, 18) - 12}:${chatTime.slice(
                    19,
                    21
                  )} PM `}
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
      {/* {chatInfo ? (
        <h1>hi</h1>
      ) : (
        <> */}
          <div className="chat__messages">
            {chatMessage.map((msg) => (
              <ChatShow
                chat={msg.data}
                key={msg.id}
                id={msg.id}
                chatId={chatId}
              />
            ))}
          </div>
          <div className="chat__message__form">
            <ChatMessageForm chatId={chatId} />
          </div>
        {/* </>
      )} */}
    </div>
  );
}

export default Chat;
