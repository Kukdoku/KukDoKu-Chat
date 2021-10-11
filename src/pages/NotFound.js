import React from "react";
// import notfound from "../Images/nofound.gif";
import hanging_404 from "../Images/hanging_404.gif";
import "./notFound.css";

function NotFound() {
  return (
    <div className="notFound">
      <img
        src={hanging_404}
        alt="Error 404 Page Not Found..."
        className="notFound__image"
      />
    </div>
  );
}

export default NotFound;
