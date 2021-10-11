import React from "react";
import chat__2_ from '../Images/chat__2_.gif'

function Nothing() {
  return (
    <div
      className="nothing"
      style={{ backgroundColor: "#E9EBF1", height: "90vh" }}
    >
      <p style={{ textAlign: "center", paddingTop: "3vh" }}>
        Welcome to <b style={{ color: "green" }}>KukDoKu-Chat</b>
      </p>
      <img
        src={chat__2_}
        style={{
          width: "fitContent",
          height: "50vh",
          marginTop: "5vh",
          marginLeft: "20vw",
        }}
      />

      <p style={{ textAlign: "center", fontSize: "12px" }}>
        {/* Enjoy Fully Encryped Text Message Deliver System 👊 */}
      </p>
    </div>
  );
}

export default Nothing;
