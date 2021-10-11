import { Avatar, Button } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import tutle from "../Images/tutle.png";
import "./header.css";
import * as ROUTES from "../constants/Routes";
import firebase from "firebase";
import ActiveUser from "../context/ActiveUser";
import Usercontext from "../context/UserContext";
import { getActiveUser } from "../loadData/FetchInfo";
import RightContent from "../context/rightContent";

function Header() {
  const history = useHistory();
  const user = useContext(Usercontext);
  const activeUser = useContext(ActiveUser);
  const { pageRight, changePageRight } = useContext(RightContent);

  // console.log(activeUser.MyName)

  const Logout = async () => {
    await firebase.auth().signOut();
    window.location.reload();
  };

  const Confirmation = () => {
    let t = window.confirm("Do You Really Want To Logout !!!");
    if (t) {
      Logout();
    }
  };
  return (
    <div className="header">
      <div className="header__left">
        <img src={tutle} alt="websiteLogo" className="header__logo" />
        <Link to={ROUTES.HOME} style={{ textDecoration: "none" }}>
          <h5 className="header__title">KuKdoKu-Chat</h5>
        </Link>
      </div>
      <div className="header__right">
        <div className="header__user">
          {activeUser ? (
            activeUser.photoUrl !== "" ? (
              <Avatar
                // onClick={() => changePageRight("profile")}
                src={activeUser.photoUrl}
                className="header__profileImage"
              />
            ) : (
              <Avatar
                // onClick={() => changePageRight("profile")}
                className="header__profileImage"
              />
            )
          ) : (
            <Avatar
              onClick={() => changePageRight("profile")}
              className="header__profileImage"
            />
          )}

          {activeUser ? <p> {activeUser.MyName}</p> : ""}
        </div>

        <Button>
          <ExitToApp className="header__exit" onClick={Confirmation} />
        </Button>
      </div>
    </div>
  );
}

export default Header;
