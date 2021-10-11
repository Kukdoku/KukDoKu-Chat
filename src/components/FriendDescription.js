import { Avatar } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import ActiveUser from "../context/ActiveUser";
import RightContent from "../context/rightContent";
import firebase from "firebase";

function FriendDescription({ chatId, setChatId, friend }) {
  const activeUser = useContext(ActiveUser);
  const {  changePageRight } = useContext(RightContent);
  const [ChatInfo, setChatInfo] = useState([]);
    const [chatTime, setChatTime] = useState("");

  // console.log(friend.userId)

  useEffect(() => {
    if (activeUser) {
      firebase
        .firestore()
        .collection("Chat")
        .doc(activeUser.chatUrl[friend.userId])
        .onSnapshot((snapshot) => {
          setChatInfo(snapshot.data());
        });
    }
  }, [chatId]);

  const pageRightContent = (content, id) => {
    // console.log("id", id);
    changePageRight(content);
    setChatId(id);
  };
  
  useEffect(() => {
    // console.log('hii')
    const timesetting = () => {
      setChatTime(new Date(ChatInfo.lastMessageTime.seconds * 1000).toString());
      // console.log('j')
    };
    if (ChatInfo.lastMessageTime) {
      timesetting();
    }
  }, [ChatInfo]);
  // console.log(activeUser)
  // console.log("chatInfo", ChatInfo);

const timeNow = new Date(Date.now()).toString().slice(0, 15);
  return (
    <div className="chatFriends__individualPerson" key={friend.userId}>
      {activeUser.photoUrl !== "" ? (
        <Avatar
          // onClick={() => changePageRight("profile")}
          style={{ cursor: "pointer" }}
          src={friend.photoUrl}
        />
      ) : (
        <Avatar
          // onClick={() => changePageRight("profile")}
          style={{ cursor: "pointer" }}
        />
      )}

      <div
        className="chatFriends__individualPerson__info"
        onClick={() =>
          pageRightContent("chat", activeUser.chatUrl[friend.userId])
        }
      >
        <h5>{friend.username}</h5>
        <p style={{ fontSize: "13px" }}><span style={{color:'green'}}>{ ChatInfo.lastMessage ? `${ChatInfo.lastMessage.slice(0,30)}...`: ChatInfo.lastMessage}</span></p>
        {timeNow.slice(0, 15) === chatTime.slice(0, 15) ? (
            chatTime.slice(16, 18) > 12 ? (
              <p
                style={{ marginLeft: "0px", fontSize: "10px", color: "gray" }}
              >
                {`today ${chatTime.slice(16, 18) - 12}:${chatTime.slice(19, 21)} PM `}
              </p>
            ) : (
              <p
                style={{ marginLeft: "0px", fontSize: "10px", color: "gray" }}
              >{`today ${chatTime.slice(16, 18)}:${chatTime.slice(
                19,
                21
              )} AM `}</p>
            )
          ) : (
            <p style={{ marginLeft: "0px", fontSize: "10px", color: "gray" }}>
              {chatTime.slice(4, 15)}
            </p>
          )}
      </div>
    </div>
  );
}

export default FriendDescription;
