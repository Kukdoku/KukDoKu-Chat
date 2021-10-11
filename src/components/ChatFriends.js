import { Avatar } from "@material-ui/core";
import {
  Group,
 
  Person,
 
} from "@material-ui/icons";
import React, { useContext, useState, useEffect } from "react";
// import { Profiler } from "react";
import ActiveUser from "../context/ActiveUser";
import RightContent from "../context/rightContent";
import Usercontext from "../context/UserContext";
import { getAllChatItem } from "../loadData/FetchInfo";
import "./chatFriends.css";
import FriendDescription from "./FriendDescription";
import GroupDescription from "./GroupDescription";

function ChatFriends({ chatId, setChatId }) {
  // const user = useContext(Usercontext);
  const activeUser = useContext(ActiveUser);
  const [chatFriends, setChatFriends] = useState([]);
  const [friendsSelected, setFriendsSelected] = useState("friends");

  const {  changePageRight } = useContext(RightContent);
  const [allGroups, setAllGroups] = useState([]);

  // console.log('user',user)

  // console.log("active", activeUser.chatUrl["mJRQEPVwSlPb7yot06c861jb4222"]);

  useEffect(() => {
    async function getAllChatFriends() {
      // console.log(activeUser.chatFriends);
      let response = await getAllChatItem(activeUser.chatFriends);
      // console.log(response);
      setChatFriends(response);
    }

    // async function getAllGroup() {
    //   let response = await getAllGroup(activeUser.groupId);
    //   setAllGroups(response);
    // }

    if (activeUser) {
      if (friendsSelected == "friends") {
        getAllChatFriends();
      } else {
        setAllGroups(activeUser.groupId);
      }
    }
  }, [friendsSelected]);

  // console.log(activeUser);

  const pageRightContent = (content, id) => {
    // console.log("id", id);
    changePageRight(content);
    setChatId(id);
  };
  // console.log("active", activeUser);
  // console.log('groups', allGroups)
  // console.log(chatFriends);
  return (
    <div className="chatFriends">
      <div
        style={{
          display: "flex",
          // justifyContent: "space-around",
          // padding: "10px",
          height: "30px",
          borderBottom: "1px solid black",
        }}
      >
        <div
          style={
            friendsSelected === "friends"
              ? {
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  backgroundColor: "gray",
                  width: "50%",
                  paddingLeft: "10px",
                }
              : {
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  backgroundColor: "white",
                  width: "50%",
                  paddingLeft: "10px",
                }
          }
          onClick={() => setFriendsSelected("friends")}
        >
          <Person />
          <p>Friends</p>
        </div>
        <div
          style={
            friendsSelected === "groups"
              ? {
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  backgroundColor: "gray",
                  width: "50%",
                  paddingLeft: "10px",
                }
              : {
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  backgroundColor: "white",
                  width: "50%",
                  paddingLeft: "10px",
                }
          }
          onClick={() => setFriendsSelected("groups")}
        >
          <Group />
          <p>Groups</p>
        </div>
      </div>
      {friendsSelected === "friends" ? (
        <div>
          {chatFriends.map((friend) => (
            <FriendDescription chatId={chatId} setChatId={setChatId} friend={friend} key={friend.docId}/>
          ))}
        </div>
      ) : (
        <div>
          {allGroups.map((group) => (
            <GroupDescription
              groupID={group}
              key={group}
              setChatId={setChatId}
              chatId={chatId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatFriends;
