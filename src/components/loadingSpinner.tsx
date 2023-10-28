"use client";
import React from "react";
import { Oval } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <div className="w-full min-h-screen h-full flex items-center dark:bg-primary-dark justify-center">
      <Oval width={50} height={50} color="#bcbdc0" secondaryColor="#d4d6d9" />
    </div>
  );
};

export default LoadingSpinner;
