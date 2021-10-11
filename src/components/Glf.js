import React from "react";

function Gif({ url }) {
  return (
    <div className="gif" style={{ maxWidth: "200px", pointer: "cursor" }}>
      <a href={url}>
        {" "}
        <img src={url} alt="sorry" style={{ width: "100%" }} />
      </a>
    </div>
  );
}

export default Gif;
