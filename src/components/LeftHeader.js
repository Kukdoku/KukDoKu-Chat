import { Avatar } from "@material-ui/core";
import {
  
  GroupAdd,
  
  PersonAdd,
  
 
} from "@material-ui/icons";
import React, { useContext } from "react";
import ActiveUser from "../context/ActiveUser";
import RightContent from "../context/rightContent";
import Usercontext from "../context/UserContext";

import "./leftHeader.css";

function LeftHeader() {
  const user = useContext(Usercontext);
  const activeUser = useContext(ActiveUser);
  const { pageRight, changePageRight } = useContext(RightContent);

  return (
    <div className="leftHeader__header">
      <div className="chatFriends__header__left">
        {activeUser ? (
          <Avatar
            // onClick={() => changePageRight("profile")}
            style={{  border: "1px solid black" }}
            src={activeUser.photoUrl}
          />
        ) : (
          <Avatar
            // onClick={() => changePageRight("profile")}
            style={{  border: "1px solid black" }}
          />
        )}
      </div>
      <div className="chatFriends__header__right">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
          onClick={() => changePageRight("searchPerson")}
        >
          <PersonAdd style={{ cursor: "pointer", marginRight: "15px" }} />
          <p style={{ fontSize: "10px" }}>Person</p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
          onClick={() => changePageRight("searchGroup")}
        >
          <GroupAdd style={{ cursor: "pointer", marginRight: "15px" }} />
          <p style={{ fontSize: "10px" }}>Groups</p>
        </div>

        {/* <Whatshot
          onClick={() => changePageRight("status")}
          style={{ cursor: "pointer" }}
        /> */}
      </div>
    </div>
  );
}

export default LeftHeader;
