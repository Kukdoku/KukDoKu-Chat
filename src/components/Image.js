import React from "react";
// import ImgsViewer from "react-images-viewer";

function Image({ url }) {
  return (
    <div className="image" style={{ maxWidth: "200px", pointer: "cursor" }}>
      <a href={url}>
        <img src={url} alt="loding.." style={{ width: "100%" }} />
      </a>
    </div>
  );
}

export default Image;
