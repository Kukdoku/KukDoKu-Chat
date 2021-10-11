import { Button } from "@material-ui/core";
import {

  AttachFile,
  Description,
  Image,
  Send,
  Speaker,
  YouTube,
} from "@material-ui/icons";
import React, { useState, useContext } from "react";
import InputEmoji from "react-input-emoji";
import "./chatMessageForm.css";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import FileShow from "./FileShow";
import firebase from "firebase";
import Usercontext from "../context/UserContext";
import ActiveUser from "../context/ActiveUser";
import { storage, db } from "../firebase";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: "60vw",
      minHeight: "70vh",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

function ChatMessageForm({ chatId }) {
  const classes = useStyles();
  const user = useContext(Usercontext);
  const activeUser = useContext(ActiveUser);

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileSrc, setFileSrc] = useState("");
  const [type, setType] = useState("");
  const [progres, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);

  function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, "");
  }

  // console.log(typeof chatId);

  // console.log('active',activeUser.chatFriends)
  // const getActiveUser = async() =>{
  //   return await getActiveUser(activeUser)
  // }

  function handleOnEnter() {
    var mess = message;

    if (file) {
      const uploadTask = storage.ref(`${type}/${file.name}`).put(file);
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
            .ref(type)
            .child(file.name)
            .getDownloadURL()
            .then((url) => {
              firebase
                .firestore()
                .collection("Chat")
                .doc(chatId)
                .collection("messages")
                .add({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  message: myTrim(mess),
                  username: user.user.displayName,
                  user_uid: user.user.uid,
                  fileUrl: url,
                  pinby: [],
                  senderpic: activeUser.photoUrl,
                  fileType: type,
                });
            })
            .then(() => {
              firebase
                .firestore()
                .collection("Chat")
                .doc(chatId)
                .update({
                  lastMessage: myTrim(mess) ? myTrim(mess) : "file is shared",
                  lastMessageTime:
                    firebase.firestore.FieldValue.serverTimestamp(),
                  MessageBy: activeUser.username,
                });
            })
            .then(() => {
              setOpen(false);
              setFile(null);
              setFileSrc("");
              setMessage("");
              setProgress(0);
              setType("");
            });
        }
      );
    } else if (myTrim(mess).length !== 0) {
      firebase
        .firestore()
        .collection("Chat")
        .doc(chatId)
        .collection("messages")
        .add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          message: myTrim(mess),
          username: user.user.displayName,
          user_uid: user.user.uid,
          fileUrl: "",
          pinby: [],
          senderpic: activeUser.photoUrl,
          fileType: "",
        })
        .then(() => {
          firebase
            .firestore()
            .collection("Chat")
            .doc(chatId)
            .update({
              lastMessage: myTrim(mess),
              lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
              MessageBy: activeUser.username,
            });
        })

        .then(() => {
          setOpen(false);
          setFile(null);
          setFileSrc("");
          setMessage("");
          setProgress(0);
          setType("");
        });
    }
  }

  const handleOpen = () => {
    setProgress(0);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const HandleFileChange = (e, Type) => {
    var file = e.target.files[0];

    // console.log(file.size);
    setFileSize(file.size)
    var reader = new FileReader();

    reader.onload = function (event) {
      setFileSrc(event.target.result);
    };

    if (file && file.type.match("image.*")) {
      reader.readAsDataURL(file);
    }
    // reader.readAsDataURL(e.target.files[0]);

    setFile(file);
    setType(Type);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <label
            htmlFor="image"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Image
              style={{ color: "blue", marginRight: "20px", cursor: "pointer" }}
            />{" "}
            <p style={{ fontSize: "10px" }}>image</p>
          </label>
          <label
            htmlFor="video"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <YouTube
              style={{ color: "red", marginRight: "20px", cursor: "pointer" }}
            />
            <p style={{ fontSize: "10px" }}>video</p>
          </label>
          <label
            htmlFor="audio"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Speaker
              style={{ color: "black", marginRight: "20px", cursor: "pointer" }}
            />{" "}
            <p style={{ fontSize: "10px" }}>audio</p>
          </label>
          <label
            htmlFor="text"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Description
              style={{ color: "green", marginRight: "20px", cursor: "pointer" }}
            />{" "}
            <p style={{ fontSize: "10px" }}>pdf</p>
          </label>
          {/* <label htmlFor="image">
            <AcUnit
              style={{ color: "pink", marginRight: "20px", cursor: "pointer" }}
            />{" "}
          </label> */}
        </div>

        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg, image/gif, image/psd"
          style={{ display: "none", cursor: "pointer" }}
          onChange={(e) => HandleFileChange(e, "image")}
        />
        <input
          type="file"
          accept="video/mp4, video/mov, video/wmv, video/avi"
          id="video"
          style={{ display: "none", cursor: "pointer" }}
          onChange={(e) => HandleFileChange(e, "video")}
        />
        <input
          type="file"
          accept="audio/mp3, audio/aif, audio/wav"
          id="audio"
          style={{ display: "none", cursor: "pointer" }}
          onChange={(e) => HandleFileChange(e, "audio")}
        />
        <input
          type="file"
          accept=".pdf"
          id="text"
          style={{ display: "none", cursor: "pointer" }}
          onChange={(e) => HandleFileChange(e, "doc")}
        />
      </h2>
      {progres ? (
        <progress
          id="file"
          value={progres}
          max="100"
          style={{ width: "100%" }}
        />
      ) : null}
      <div id="simple-modal-description">
        <div
          style={{ margin: "30px", display: "flex", justifyContent: "center" }}
        >
          <FileShow type={type} fileSrc={fileSrc} file={file} />
        </div>
        {fileSize > 10000000 ? (
          <p style={{ fontSize: "13px", color: "red",textAlign:'center' }}>
            File is Too large select another File 👎👎
          </p>
        ) : (
          <p></p>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            width: "90%",
            display: "flex",
          }}
        >
          <InputEmoji
            value={message}
            onChange={setMessage}
            // cleanOnEnter
            // onEnter={handleOnEnter}
            placeholder="Type a message"
          />
          <Button
            // style={{ right: "10px", bottom: "50px" }}
            onClick={handleOnEnter}
            disabled={fileSize>10000000 || !file}
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="chatMessageForm">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <div className="chatMessageForm__file">
        <AttachFile onClick={() => setOpen(true)} />
      </div>

      <InputEmoji
        value={message}
        onChange={setMessage}
        cleanOnEnter
        onEnter={handleOnEnter}
        placeholder="Type a message"
      />
    </div>
  );
}

export default ChatMessageForm;
