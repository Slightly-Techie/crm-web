import React from "react";
import { Oval } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Oval width={100} height={100} color="#bcbdc0" secondaryColor="#d4d6d9" />
    </div>
  );
};

export default Loading;
