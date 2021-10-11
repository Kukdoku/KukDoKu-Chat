import React from "react";
// import logger from "logging-library";
// import PDFViewer from "pdf-viewer-reactjs";
// import { CustomErrorComponent } from "custom-error";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

function Pdf({ url }) {
  return (
    <div className="Pdf">
      <a href={url} target='_blank'>
        Watch Pdf File <CloudDownloadIcon />
      </a>
    </div>
  );
}

export default Pdf;
