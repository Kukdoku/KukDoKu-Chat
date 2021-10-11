import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import * as ROUTES from "./constants/Routes";
import ActiveUser from "./context/ActiveUser";
import Usercontext from "./context/UserContext";
import useAuthListener from "./hooks/UseAuthListener";
import loading from "./Images/loading.gif";
import offline from "./Images/offline.gif";
import { getActiveUser } from "./loadData/FetchInfo";
import firebase from "firebase";
import RightContent from "./context/rightContent";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { user } = useAuthListener();
  const [control, setControl] = useState(false);
  const [acitiveUser, setActiveUser] = useState(null);
  const [online, setOnline] = useState(true);

  const [pageRight, setPageRight] = useState("nothing");

  const changePageRight = (data) => {
    setPageRight(data);
  };

  useEffect(() => {
    async function getInformation(uid) {
      try {
        firebase
          .firestore()
          .collection("users")
          .where("userId", "==", uid)
          .onSnapshot((snapshot) => {
            setActiveUser(
              snapshot.docs.map((doc) => ({
                ...doc.data(),
                docId: doc.id,
              }))
            );
          });
      } catch (error) {
        alert("something is wrong");
      } finally {
        setControl(true);
      }
    }

    if (window.navigator.onLine) {
      if (user) {
        getInformation(user.uid);
      } else {
        setControl(true);
      }
    } else {
      setOnline(false);
      // alert("go to online");
    }
  }, [firebase]);

  // console.log(user);

  return online ? (
    control ? (
      acitiveUser && user ? (
        <Usercontext.Provider value={{ user }}>
          <ActiveUser.Provider value={acitiveUser[0]}>
            <RightContent.Provider value={{ pageRight, changePageRight }}>
              <div className="app">
                <Router>
                  <Suspense
                    fallback={
                      <img
                        src={loading}
                        alt="Loading..."
                        className="app_loading"
                      />
                    }
                  >
                    <Switch>
                      <Route path={ROUTES.HOME} component={Home} exact />
                      <Route component={NotFound} />
                    </Switch>
                  </Suspense>
                </Router>
              </div>
            </RightContent.Provider>
          </ActiveUser.Provider>
        </Usercontext.Provider>
      ) : (
        <div className="app__loginSignup">
          <Router>
            <Suspense
              fallback={
                <img src={loading} alt="Loading..." className="app_loading" />
              }
            >
              <Switch>
                <Route path={ROUTES.HOME} component={Login} exact />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </Router>
        </div>
      )
    ) : (
      <div>
        <img src={loading} alt="Loading..." className="app_loading" />
      </div>
    )
  ) : (
    <div>
      <img
        src={offline}
        alt="offline..."
        className="app_loading"
        style={{ height: "2000px" }}
      />
    </div>
  );
}

export default App;
