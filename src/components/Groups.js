import React, {useContext} from "react";
import ActiveUser from "../context/ActiveUser";

function Groups() {
  const activeUser = useContext(ActiveUser)
//  console.log(activeUser)
  return (
    <div className="groups">
      <h1>gorup</h1>
    </div>
  );
}

export default Groups;
