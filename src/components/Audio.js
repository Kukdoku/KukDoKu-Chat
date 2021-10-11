import React from "react";
import ReactAudioPlayer from "react-audio-player";

function Audio({ url }) {
  return (
    <div className="audio">
      <ReactAudioPlayer src={url} autoplay="true" controls={true} />
    </div>
  );
}

export default Audio;
