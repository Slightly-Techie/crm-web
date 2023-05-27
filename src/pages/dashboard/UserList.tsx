import React from "react";
import Recent from "../../components/Recent";
import Team from "../../components/Team";

function UserList() {
  return (
    <div className="flex gap-4 w-full">
      <Recent />
      <Team />
    </div>
  );
}

export default UserList;
