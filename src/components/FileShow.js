import React from "react";
import upload from "../Images/upload.png";
// import play from "../Images/play.png";
// import { ReactVideo } from "reactjs-media";

function FileShow({ type, fileSrc,file }) {
  let fileShow;

  if (type === "") {
    fileShow = (
      <img
        src={upload}
        alt="Please Upload something"
        style={{ width: "25vw", maxWidth: "40vh" }}
      />
    );
  } else if (type === "image") {
    fileShow = (
      <img
        src={fileSrc}
        alt="Please Upload something"
        style={{ width: "25vw", maxWidth: "40vh" }}
      />
    );
  } else if (type === "video" && file) {
    fileShow = <div>
        <h5>{file.name}</h5>
    </div>
  } else if (type === "audio" && file) {
    fileShow = (
      <div>
        <h5>{file.name}</h5>
      </div>
    );
  } else if (type === "doc" && file) {
    fileShow = (
      <div>
        <h5>{file.name}</h5>
      </div>
    );
  }
  return <div className="fileShow">{fileShow}</div>;
}

export default FileShow;
