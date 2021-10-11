import {
  ArrowBack,
  ArrowDropDown,
  ArrowDropUp,
  Search,
} from "@material-ui/icons";
import React, { useState, useContext } from "react";
import "./searchGroup.css";
// import group from "../Images/group.png";
import { Avatar, Button } from "@material-ui/core";
import { storage, db } from "../firebase";
import firebase from "firebase";
import ActiveUser from "../context/ActiveUser";
import { getSearchedGroup } from "../loadData/FetchInfo";

function SearchGroup() {
  const [search, setSearch] = useState("search");
  const [file, setFile] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [fileSrc, setFileSrc] = useState("");
  const [progress, setProgress] = useState(0);
  const [searchByName, setSearchByName] = useState("");
  const activeUser = useContext(ActiveUser);
  const [searchedGroup, setSearchedGroup] = useState([]);
  const [showGroup, setShowGroup] = useState(false);
  const [groupList, setGroupList] = useState([]);

  //   console.log(activeUser);
  const createGroup = (e) => {
    e.preventDefault();
    const uploadTask = storage.ref(`image/${file.name}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // console.log(error.message);
        alert(error.message);
      },
      () => {
        storage
          .ref("image")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            firebase
              .firestore()
              .collection("Chat")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                groupName: groupName,
                admin: activeUser.username,
                admin_uid: activeUser.userId,
                groupIcon: url,
                members: [activeUser.userId],
                lastMessage: "Group is just Created",
                lastMessageTime:
                  firebase.firestore.FieldValue.serverTimestamp(),
                MessageBy: activeUser.username,
              })
              .then((docRef) => {
                // console.log("data", docRef);
                firebase
                  .firestore()
                  .collection("users")
                  .doc(activeUser.docId)
                  .update({ groupId: [...activeUser.groupId, docRef.id] });
              });
          })

          .then(() => {
            setFile(null);
            setFileSrc("");
            setGroupName("");
            setProgress(0);
            setSearch("search");
          });
      }
    );
  };

  const HandleFileChange = (e, Type) => {
    var file = e.target.files[0];

    var reader = new FileReader();

    reader.onload = function (event) {
      setFileSrc(event.target.result);
    };

    if (file && file.type.match("image.*")) {
      reader.readAsDataURL(file);
    }
    // reader.readAsDataURL(e.target.files[0]);

    setFile(file);
  };

  const searchAllGroup = async () => {
    const response = await getSearchedGroup(searchByName);
    // console.log('respnse',response)
    await response.onSnapshot((snapshot) => {
      setSearchedGroup(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    // console.log("groups", searchedGroup[0].id);
    // setSearchedGroup(response);
  };

  const joinGroup = async (groupId, groupMembers) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(activeUser.docId)
      .update({
        groupId: [...activeUser.groupId, groupId],
      });

    await firebase
      .firestore()
      .collection("Chat")
      .doc(groupId)
      .update({
        members: [...groupMembers, activeUser.userId],
      });
  };

  const ExitGroup = async (groupId, groupMembers) => {
    const RemoveItem = (llist, item) => {
      let index = llist.indexOf(item);
      if (index > -1) {
        llist.splice(index, 1);
      }
      return llist;
    };

    await firebase
      .firestore()
      .collection("users")
      .doc(activeUser.docId)
      .update({
        groupId: RemoveItem(activeUser.groupId, groupId),
      });

    await firebase
      .firestore()
      .collection("Chat")
      .doc(groupId)
      .update({
        members: RemoveItem(groupMembers, activeUser.userId),
      });
  };
  // console.log("searched", !searchedGroup);

  const HideGroup = () => {
    setShowGroup(!showGroup);
  };
  const ShowGroup = () => {
    setShowGroup(!showGroup);
    firebase
      .firestore()
      .collection("Chat")
      .where("admin", "!=", "")
      .limit(10)
      .onSnapshot((snapshot) => {
        setGroupList(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
  };
  // console.log(groupList);
  return (
    <div className="searchGroup">
      {search === "search" ? (
        <button
          onClick={() => setSearch("createGroup")}
          style={{
            borderRadius: "5px",
            border: "2px solid black",
            marginLeft: "10px",
            height: "30px",
            backgroundColor: "#11A8CD",
            cursor: "pointer",
            marginTop: "30px",
            marginLeft: "10px",
          }}
        >
          Create New Group
        </button>
      ) : null}

      {search === "search" ? (
        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "30px",
            }}
          >
            Search Group By Group Name
          </h3>
          <div className="group__portel">
            <input
              type="text"
              className="group__portel__input"
              style={{
                width: "60%",
                height: "30px",
                borderRadius: "99px",
                border: "2px solid black",
                paddingLeft: "10px",
              }}
              placeholder="search group..."
              onChange={(e) => setSearchByName(e.target.value)}
            />

            <button
              style={{
                borderRadius: "199px",
                border: "2px solid black",
                marginLeft: "10px",
                cursor: "pointer",
              }}
              onClick={searchAllGroup}
            >
              <Search />
            </button>
          </div>
          <br />
          {searchedGroup.length ? (
            searchedGroup.map((group) => (
              <div
                key={group.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "20px",
                }}
              >
                <Avatar
                  src={group.groupIcon}
                  style={{ width: 70, height: 70 }}
                />
                <div style={{ marginLeft: "20px" }}>
                  <h4>
                    {" "}
                    <span style={{ color: "green" }}>{group.groupName}</span>
                  </h4>
                  <p>
                    <b>Admin: </b>
                    {group.admin}
                  </p>
                  <p style={{ color: "red" }}>
                    Total Members: {group.members.length}
                  </p>
                </div>
                {group.members.includes(activeUser.userId) ? (
                  <button
                    style={{
                      marginLeft: "30px",
                      height: "40px",
                      borderRadius: "12px",
                    }}
                    onClick={() => ExitGroup(group.id, group.members)}
                  >
                    Exit
                  </button>
                ) : (
                  <button
                    style={{
                      marginLeft: "30px",
                      height: "40px",
                      borderRadius: "12px",
                    }}
                    onClick={() => joinGroup(group.id, group.members)}
                  >
                    Join
                  </button>
                )}
              </div>
            ))
          ) : (
            <div>
              <p>No group is found at this name</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSearch("search")}
            style={{
              borderRadius: "99px",
              border: "2px solid black",
              marginLeft: "10px",
              height: "30px",
              backgroundColor: "#11A8CD",
              margin: "20px",
              cursor: "pointer",
            }}
          >
            <ArrowBack />
          </button>
          <h3
            style={{
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            create New Group
          </h3>
          {progress ? (
            <progress
              id="file"
              value={progress}
              max="100"
              style={{ width: "100%" }}
            />
          ) : null}
          <div style={{ textAlign: "center", marginLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {fileSrc ? (
                <Avatar
                  src={fileSrc}
                  alt="group icon"
                  style={{ width: 150, height: 150 }}
                />
              ) : (
                <Avatar style={{ width: 150, height: 150 }}>No Image</Avatar>
              )}
            </div>

            <form style={{ textAlign: "center" }} onSubmit={createGroup}>
              <input
                type="text"
                placeholder="group Name..."
                style={{
                  width: "80%",
                  height: "30px",
                  borderRadius: "99px",
                  border: "2px solid black",
                  paddingLeft: "10px",
                  marginTop: "10px",
                }}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <input
                type="file"
                onChange={HandleFileChange}
                accept=".jpg, .png, .gif"
              />
              <br />
              <button
                className="search__group"
                style={{
                  borderRadius: "5px",
                  border: "2px solid black",
                  marginLeft: "10px",
                  height: "30px",
                  backgroundColor: "#11A8CD",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
                type="submit"
                disabled={!file || !groupName}
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}
      <hr style={{marginTop:'10px'}}/>
      <div style={{margin:'20px'}}>
        <p></p>
        {showGroup ? (
          <Button onClick={() => HideGroup()}>
            Hide Groups Information
            <ArrowDropUp />
          </Button>
        ) : (
          <Button onClick={() => ShowGroup()}>
            Show Some Random Groups
            <ArrowDropDown />
          </Button>
        )}
        {showGroup
          ? groupList.map((group) => (
              <div
                key={group.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "20px",
                }}
              >
                <img
                  src={group.data.groupIcon}
                  style={{ width: '60px', height: '60px' }}
                />
                <div style={{ marginLeft: "20px", fontSize: "15px" }}>
                  <h5>
                    {" "}
                    <span style={{ color: "green" }}>
                      {group.data.groupName}
                    </span>
                  </h5>
                  <p style={{fontSize:'13px'}}>
                    <b>Admin: </b>
                    {group.data.admin}
                  </p>
                  <p style={{ color: "red", fontSize: "12px" }}>
                    Total Members: {group.data.members.length}
                  </p>
                  {group.data.members.includes(activeUser.userId) ? (
                    <p style={{ fontSize: "10px" }}>
                      you are already a member of this group
                    </p>
                  ) : (
                    <p style={{ fontSize: "10px" }}>
                      Search group to Join Option
                    </p>
                  )}
                </div>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
}

export default SearchGroup;
