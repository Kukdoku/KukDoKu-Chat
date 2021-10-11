import { Avatar } from "@material-ui/core";
import React, { useState, useContext, useEffect } from "react";
import ActiveUser from "../context/ActiveUser";
import RightContent from "../context/rightContent";
import { groupDetailById } from "../loadData/FetchInfo";
import "./GroupDescription.css";

function GroupDescription({ groupID, setChatId, chatId }) {
  const [groupDetail, setGroupDetail] = useState([]);
  const activeUser = useContext(ActiveUser);
   const { changePageRight } = useContext(RightContent);

   const [chatTime, setChatTime] = useState("");
   const timeNow = new Date(Date.now()).toString().slice(0, 15);

  useEffect(() => {
    const getGroupDetails = async () => {
      const response = await groupDetailById(groupID);
    //   console.log("response", response);
      await response.onSnapshot((snapshot) => {
        setGroupDetail(snapshot.data());
      });
    };

    if (activeUser) {
      getGroupDetails();
    }
  }, []);

  useEffect(() => {
    // console.log('hii')
    const timesetting = () => {
      setChatTime(new Date(groupDetail.lastMessageTime.seconds * 1000).toString());
      // console.log('j')
    };
    if (groupDetail.lastMessageTime) {
      timesetting();
    }
  }, [groupDetail]);

//   console.log("goup", groupDetail);

  const pageRightContent = (content, id) => {
    // console.log("id", id);
    changePageRight(content);
    setChatId(id);
  };

// const timeNow = new Date(Date.now()).toString().slice(0, 15);
  return (
    <div className="groupDes">
      {groupDetail.groupIcon !== "" ? (
        <Avatar
          //   onClick={() => changePageRight("profile")}
          style={{ cursor: "pointer" }}
          src={groupDetail.groupIcon}
        />
      ) : (
        <Avatar
          //   onClick={() => changePageRight("profile")}
          style={{ cursor: "pointer" }}
        />
      )}

      <div
        className="groupDes__indi"
        onClick={() => pageRightContent("groupChat", groupID)}
      >
        <h5>{groupDetail.groupName}</h5>
        <p style={{ fontSize: "13px" }}>
          <span style={{ color: "green" }}>{ groupDetail.lastMessage ? groupDetail.lastMessage.slice(0,28): groupDetail.lastMessage}
           </span>
           {/* by{" "}
          <b>{groupDetail.MessageBy}</b> */}
        </p>
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

export default GroupDescription;
