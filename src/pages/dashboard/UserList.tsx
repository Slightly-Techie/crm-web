import React from "react";
import Recent from "../../components/Recent";
import Team from "../../components/Team";

function UserList() {
  return (
    <div className="flex px-5 gap-4 mt-8">
      <Recent />
      <Team />
    </div>
  );
}

export default UserList;
