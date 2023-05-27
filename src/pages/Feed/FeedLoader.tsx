import React from "react";
import { Oval } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Oval width={50} height={50} color="#bcbdc0" secondaryColor="#d4d6d9" />
    </div>
  );
};

export default Loading;
