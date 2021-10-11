import React, {  useState } from "react";
import "./Login.css";
import chat__logo from "../Images/tutle.png";
import { Button } from "@material-ui/core";
import { provider } from "../firebase";
import firebase from "firebase";
import { doesUserExist } from "../loadData/FetchInfo";

function Login() {
  // const [confirm, setConfirm] = useState("ok");
  // const [credential, setCredential] = useState("");
  // const [token, setToken] = useState("");
  // const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const GoogleLogin = async () => {
    // console.log(window.navigator.onLine);
    if (window.navigator.onLine) {
      await firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          console.log('hi')
          // console.log(result);
          // console.log(result.additionalUserInfo.isNewUser);
          if (result.additionalUserInfo.isNewUser) {
            let displayName = result.user.displayName;
            let joinDate = result.user.metadata.creationTime;
            let email = result.user.email;
            let uid = result.user.uid;
            let photo = result.user.photoURL;
            let chat = [result.user.uid];
            let url = {};
            url[uid] = uid + "++" + uid;
            console.log("hi");
            // console.log(result.additionalUserInfo.isNewUser);

            firebase
              .firestore()
              .collection("users")
              .add({
                username: displayName,
                MyName: displayName,
                JoinWithUs: joinDate,
                chatFriends: chat,
                chatUrl: url,
                emailAddress: email,
                userId: uid,
                photoUrl: photo,
                groupId: [],
              })
              .then(() => {
                firebase
                  .firestore()
                  .collection("Chat")
                  .doc(uid + "++" + uid)
                  .set({
                    lastMessage: "Thanks to connect with us",
                    lastMessageTime:
                      firebase.firestore.FieldValue.serverTimestamp(),
                    MessageBy: displayName,
                    photo1Url: photo,
                    photo2Url: photo,
                    user1Name: displayName,
                    user2Name: displayName,
                  });
              })
              .then(() => {
                // console.log('h')
                window.location.reload();
              })
              .catch((error) => setError(error.message));
          }
          else{
            window.location.reload();
          }
        });
    } else {

      alert("Yor System is offline . Go Online ❗❗");
    }
    // window.location.reload();
  };

  return (
    <div className="login">
      <div className="login__align">
        <img
          src={chat__logo}
          alt="This is Website Logo"
          className="login__logo"
        />
        <div>
          <h1 className="login__appName">KUKDOKU-CHAT</h1>
        </div>
        <p>{error}</p>
        <div className="login__button">
          <Button
            variant="contained"
            className="login__button"
            color="secondary"
            onClick={GoogleLogin}
          >
            Start With Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
