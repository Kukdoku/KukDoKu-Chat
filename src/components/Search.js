import {  Button } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp, SearchOutlined } from "@material-ui/icons";
import React, { useState, useEffect, useContext } from "react";
import ActiveUser from "../context/ActiveUser";
import Usercontext from "../context/UserContext";
import { getSearchedUser } from "../loadData/FetchInfo";
import "./search.css";
import firebase from "firebase";

function Search() {
  const user = useContext(Usercontext);
  const activeUser = useContext(ActiveUser);
  const [searchItem, setSearchItem] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [yousearched, setYouSearched] = useState("");
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);

  const getSearchingUser = async () => {
    const response = await getSearchedUser(searchItem);
    // console.log(response);
    setSearchedUser(response);
    // console.log(searchedUser);
    // console.log(activeUser);
    setYouSearched(searchItem);
  };

  const AddFriend = async (profileid) => {
    let ChatId = activeUser.userId + "++" + profileid;
    let activeUserUrl = { ...activeUser.chatUrl };
    activeUserUrl[profileid] = ChatId;
    await firebase
      .firestore()
      .collection("users")
      .doc(activeUser.docId)
      .update({
        chatFriends: [...activeUser.chatFriends, profileid],
        chatUrl: activeUserUrl,
      });
    let activeUid = activeUser.userId;
    let activeUserUrl1 = { ...searchedUser[0].chatUrl };
    activeUserUrl1[activeUid] = ChatId;
    await firebase
      .firestore()
      .collection("users")
      .doc(searchedUser[0].docId)
      .update({
        chatFriends: [...searchedUser[0].chatFriends, activeUser.userId],
        chatUrl: activeUserUrl1,
      });

    await firebase.firestore().collection("Chat").doc(ChatId).set({
      lastMessage: "You are just added",
      lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
      MessageBy: activeUser.username,
      photo1Url: activeUser.photoUrl,
      photo2Url: searchedUser[0].photoUrl,
      user1Name: activeUser.username,
      user2Name: searchedUser[0].username,
    });
    setSearchItem("");
  };

  const HideUser = () => {
    setShow(!show);
  };
  const ShowUser = () => {
    setShow(!show);
    firebase
      .firestore()
      .collection("users")
      .limit(10)
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
  };

  // console.log(users)

  return (
    <div className="search">
      <div className="search__here">
        <input
          placeholder="Search User By  Email Id"
          className="search__input"
          style={{
            width: "414px",
            height: "20px",
            borderRadius: "99px",
            padding: "10px",
          }}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <Button
          style={{ borderRadius: "100px", height: "45px" }}
          onClick={getSearchingUser}
        >
          <SearchOutlined style={{ marginLeft: "0px" }} />
        </Button>
      </div>

      <div className="search__item">
        {searchedUser === null ? (
          <p style={{ color: "gray", fontSize: "15px" }}>
            search User By email Id:{" "}
          </p>
        ) : searchedUser.length == 0 ? (
          <p style={{ color: "black", fontSize: "18px" }}>
            No User Exixt with Email Id:{" "}
            <span style={{ color: "red" }}>{yousearched}</span>
          </p>
        ) : (
          <div className="search__itemUser">
            {searchedUser[0].photoUrl ? (
              <img src={searchedUser[0].photoUrl} alt="not found image" />
            ) : (
              <img />
            )}

            <div style={{ marginLeft: "10px" }}>
              <h5>{searchedUser[0].username}</h5>
              {/* <h6>{searchedUser[0].MyName}</h6> */}
              <p style={{ fontSize: "13px", marginTop: "5px" }}>
                {searchedUser[0].emailAddress}
              </p>
              {/* <p style={{ fontSize: "13px" }}>{searchedUser[0].userId}</p> */}

              {activeUser.chatFriends.includes(searchedUser[0].userId) ? (
                <Button
                  style={{
                    width: "150px",
                    marginTop: "20px",
                    backgroundColor: "pink",
                    color: "black",
                  }}
                  disabled
                >
                  Friend
                </Button>
              ) : (
                <Button
                  onClick={() => AddFriend(searchedUser[0].userId)}
                  style={{
                    width: "150px",
                    marginTop: "20px",
                    backgroundColor: "light green",
                    color: "black",
                  }}
                >
                  Add As Friend
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <h4 style={{marginTop:'30px'}}>
        Watch Some Users List{" "}
        {show ? (
          <Button onClick={() => HideUser()}>
            Hide <ArrowDropUp />
          </Button>
        ) : (
          <Button onClick={() => ShowUser()}>
            Show
            <ArrowDropDown />
          </Button>
        )}{" "}
      </h4>
      {show
        ? users.map((doc) => (
          
            <div style={{display:'flex',margin:"20px"}} key={doc.id}>
              {doc.data.photoUrl ? (
                <img src={doc.data.photoUrl} alt="not found image" style={{height:'40px'}} />
              ) : (
                <img />
              )}

              <div style={{ marginLeft: "10px" }}>
                <h5>{doc.data.username}</h5>
                {/* <h6>{searchedUser[0].MyName}</h6> */}
                <p style={{ fontSize: "13px", marginTop: "5px" }}>
                  {doc.data.emailAddress}
                </p>
              </div>
            </div>
          ))
        : ""}
    </div>
  );
}

export default Search;
