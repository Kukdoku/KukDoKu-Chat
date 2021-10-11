import { Avatar, Card, CardContent, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import ActiveUser from "../context/ActiveUser";
import Audio from "./Audio";
import "./chatShow.css";
import Gif from "./Glf";
import Image from "./Image";
import Pdf from "./Pdf";
import Video from "./Video";
import {Star, StarBorder} from '@material-ui/icons';
import firebase from 'firebase';

function ChatShow({ chat,id,chatId }) {
  const activeUser = useContext(ActiveUser);
  const [chatTime, setChatTime] = useState("");

  //   console.log(message.username);
  //   console.log(username);
  const isUser = chat.username === activeUser.username;
  //   console.log(username, message.userame);

  // console.log(isUser);
  let comp;

  useEffect(() => {
    const timesetting = () => {
      setChatTime(new Date(chat.timestamp.seconds * 1000).toString());
    };
    if (chat.timestamp) {
      timesetting();
    }
  }, [chat]);

  if (chat.fileType === "image") {
    comp = <Image url={chat.fileUrl} />;
  } else if (chat.fileType === "audio") {
    comp = <Audio url={chat.fileUrl} />;
  } else if (chat.fileType === "video") {
    comp = <Video url={chat.fileUrl} />;
  } else if (chat.fileType === "doc") {
    comp = <Pdf url={chat.fileUrl} />;
  } else if (chat.fileType === "GIF") {
    comp = <Gif url={chat.fileUrl} />;
  }
  // console.log( Date.now())
  // console.log(new Date(chat.timestamp.seconds*1000))
  const timeNow = new Date(Date.now()).toString().slice(0, 15);
  // const chatTime = new Date(chat.timestamp.seconds * 1000).toString().slice(0, 15)
  // console.log(chat)
  // console.log(id)
  const SaveMessage = () =>{
firebase.firestore().collection('Chat').doc(chatId).collection('messages').doc(id).update({
  pinby:[...chat.pinby,activeUser.userId]
})
  }

  const RemoveMessage = () =>{
    let newPin = chat.pinby
    const index = newPin.indexOf(activeUser.userId);
if (index > -1) {
  newPin.splice(index, 1);
}
firebase.firestore().collection('Chat').doc(chatId).collection('messages').doc(id).update({
  pinby:newPin
})
  }
  return (
    <div className={`chat ${isUser && "chat__user"}`}>
      <div
        style={{
          display: "flex",
          marginBottom: "5px",
          alignItems: "center",
          // height: "10px",
          marginTop: "10px",
          marginLeft: "10px",
        }}
        className="chat__messagess"
      >
        {chat.senderpic ? <Avatar src={chat.senderpic} /> : <Avatar />}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <b style={{ marginLeft: "5px", fontSize: "10px" }}>
            {chat.username ? `${chat.username}` : `Unknown User`}
          </b>
          <div style={{display:'flex',alignItems:'center'}}>
          {timeNow.slice(0, 15) === chatTime.slice(0, 15) ? (
            chatTime.slice(16, 18) > 12 ? (
              <p
                style={{ marginLeft: "5px", fontSize: "10px", color: "white" }}
              >
                {`today ${chatTime.slice(16, 18) - 12}:${chatTime.slice(19, 21)} PM `}
              </p>
            ) : (
              <p
                style={{ marginLeft: "5px", fontSize: "10px", color: "white" }}
              >{`today ${chatTime.slice(16, 18)}:${chatTime.slice(
                19,
                21
              )} AM `}</p>
            )
          ) : (
            <p style={{ marginLeft: "5px", fontSize: "10px", color: "white" }}>
              {chatTime.slice(4, 15)}
            </p>
          )}
          {chat.pinby.includes(activeUser.userId)  
          ?<Star style={{height:'13px', cursor:'pointer'}} onClick={() => RemoveMessage()}/>
          :<StarBorder style={{height:'13px', cursor:'pointer' }} onClick={()=> SaveMessage()}/>}
          
          
          </div>
        </div>
        {/* <small>{chat.timestamp.toDate()}</small> */}
      </div>
      <Card className={isUser ? "chat__userCard" : "chat__questCard"} >
        <CardContent>
          <Typography color="initial" varient="h5" component="h2">
            {chat.message !== "" ? chat.message : null}
            {chat.fileType !== "None" ? comp : null}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );

  //   const activeUser = useContext(ActiveUser);
  //   return chat && activeUser ? (
  //     // {chat.message_sender_uid === activeUser}
  //     <div
  //       className="chatShow"
  //       style={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //       }}
  //     >
  //       {chat.user_uid === activeUser.userId ? <div></div> : null}
  //       <div>
  //         <div style={{ display: "flex" }} className="chatShowOk">
  //           {chat.senderpic !== "" ? (
  //             <Avatar
  //               src={chat.senderpic}
  //               className="senderPic"
  //               style={
  //                 chat.user_uid === activeUser.userId
  //                   ? { border: "2px solid green" }
  //                   : { border: "2px solid red" }
  //               }
  //             />
  //           ) : (
  //             <Avatar className="senderPic" />
  //           )}
  //           <h6
  //             style={{
  //               display: "relative",
  //               marginTop: "10px",
  //               marginLeft: "5px",
  //             }}
  //           >
  //             {chat.username}
  //             <span style={{ fontSize: "7px", color: "gray", marginLeft: "5px" }}>
  //               {" "}
  //               {chat.timeStamp ? chat.timeStamp.toDate().toDateString() : null}
  //             </span>
  //           </h6>
  //         </div>
  //         {/* <p>{chat.timeStamp}</p> */}
  //         {chat.fileUrl ? (
  //           <div
  //             className="chatShow__message"
  //             style={
  //               chat.user_uid === activeUser.userId
  //                 ? { backgroundColor: "#ffa680" }
  //                 : { backgroundColor: "#9afcb1" }
  //             }
  //           >
  //             <p>file</p>
  //           </div>
  //         ) : (
  //           <div
  //             className="chatShow__message"
  //             style={
  //               chat.user_uid === activeUser.userId
  //                 ? { backgroundColor: "#ffa680" }
  //                 : { backgroundColor: "#9afcb1" }
  //             }
  //           >
  //             <p style={{ padding: "10px", fontSize: "13px" }}>{chat.message}</p>
  //             <small
  //               style={{ color: "gray", marginLeft: "auto", fontSize: "9px" }}
  //             >
  //               timeasdfasdfasdf adsf dsfa asdfj
  //             </small>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   ) : null;
}

export default ChatShow;
