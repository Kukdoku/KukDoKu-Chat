import { Description } from "@material-ui/icons";
import React, { useState, useContext } from "react";

import Chat from "../components/Chat";
import ChatFriends from "../components/ChatFriends";
// import Groups from "../components/Groups";
import Header from "../components/Header";
import Nothing from "../components/Nothing";
import Profile from "../components/Profile";
import Search from "../components/Search";
import Status from "../components/Status";
import "./home.css";
import RightContent from "../context/rightContent";
import LeftHeader from "../components/LeftHeader";
import SearchGroup from "../components/SearchGroup";
import GroupChat from "../components/GroupChat";

function Home() {
  // const [sidebar, setSideBar] = useState("friends");

  const [chatId, setChatId] = useState("");
  // const [chatFriend, setChatFriend] = useState("");
  // const [chatWith, setChatWith] = useState('');

  const { pageRight } = useContext(RightContent);

  // console.log("right", pageRight);

  let t = document.body.clientWidth;

  const [hide, setHide] = useState(t < 800 ? true : false);

  let rightContent;
  if (pageRight === "nothing") {
    rightContent = <Nothing />;
  } else if (pageRight === "chat") {
    rightContent = <Chat chatId={chatId} />;
  } else if (pageRight === "groupChat") {
    rightContent = <GroupChat chatId={chatId} />;
  } else if (pageRight === "description") {
    rightContent = <Description />;
  } else if (pageRight === "profile") {
    rightContent = <Profile />;
  } else if (pageRight === "status") {
    rightContent = <Status />;
  } else if (pageRight === "searchPerson") {
    rightContent = <Search />;
  } else if (pageRight === "searchGroup") {
    rightContent = <SearchGroup />;
  }
  // console.log(hide);
  return (
    <div className="home">
      <div className="home__header">
        <Header />
      </div>
      <div className="home__content">
        <div className="home__left">
          <LeftHeader />

          <ChatFriends chatId={chatId} setChatId={setChatId} />
        </div>
        <div className="home__right">{rightContent}</div>
      </div>
    </div>
  );
}

export default Home;
