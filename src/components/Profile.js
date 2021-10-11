import { Avatar, Button } from "@material-ui/core";
import {
  CameraAlt,
  FileCopy,
  Group,
  Person,
  Whatshot,
} from "@material-ui/icons";

import React, { useContext, useState } from "react";

import ActiveUser from "../context/ActiveUser";

import "./profile.css";

function Profile() {
  const activeUser = useContext(ActiveUser);

  const [profileChoice, setProfileChoice] = useState("allPosts");

  return (
    <div className="profile">
      <div className="profile__top">
        <Avatar className="profile__pic" src={activeUser.photoUrl} />
        <div style={{ marginLeft: "30px" }}>
          <h4>{activeUser.username}</h4>
          <h5>{activeUser.MyName}</h5>
          <p>{activeUser.emailAddress}</p>

          <input type="file" />
          <CameraAlt className="profile__pic__update" />
        </div>
      </div>
      <div>
        <p>
          <b>statement:</b> Life is so beautiful
        </p>
      </div>
      <div className="profile__choice">
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
              profileChoice === "allPosts"
                ? {
                    cursor: "pointer",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: "#cfcfcf",
                    width: "25%",
                    paddingLeft: "10px",
                  }
                : {
                    cursor: "pointer",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: "white",
                    width: "25%",
                    paddingLeft: "10px",
                  }
            }
            onClick={() => setProfileChoice("allPosts")}
          >
            <FileCopy />

            <p>ShareFiles</p>
          </div>
          <div
            style={
              profileChoice === "Friends"
                ? {
                    cursor: "pointer",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: "#cfcfcf",
                    width: "25%",
                    paddingLeft: "10px",
                  }
                : {
                    cursor: "pointer",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: "white",
                    width: "25%",
                    paddingLeft: "10px",
                  }
            }
            onClick={() => setProfileChoice("Friends")}
          >
            <Person />
            <p>Friends</p>
          </div>

          <div
            style={
              profileChoice === "groups"
                ? {
                    cursor: "pointer",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: "#cfcfcf",
                    width: "25%",
                    paddingLeft: "10px",
                  }
                : {
                    cursor: "pointer",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: "white",
                    width: "25%",
                    paddingLeft: "10px",
                  }
            }
            onClick={() => setProfileChoice("groups")}
          >
            <Group />
            <p>Groups</p>
          </div>

          <div
            style={
              profileChoice === "Status"
                ? {
                    cursor: "pointer",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: "#cfcfcf",
                    width: "25%",
                    paddingLeft: "10px",
                  }
                : {
                    cursor: "pointer",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: "white",
                    width: "25%",
                    paddingLeft: "10px",
                  }
            }
            onClick={() => setProfileChoice("Status")}
          >
            <Whatshot />
            <p>Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
