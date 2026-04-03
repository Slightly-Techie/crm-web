"use client";
import React from "react";
import { Oval } from "react-loader-spinner";

const LoadingSpinner = ({ fullScreen = true }: { fullScreen?: boolean } = {}) => {
  const containerClass = fullScreen
    ? "w-full min-h-screen h-full flex items-center justify-center bg-surface dark:bg-surface-dark"
    : "flex items-center justify-center";

  return (
    <div className={containerClass}>
      <Oval
        width={50}
        height={50}
        color="#2d5a27"
        secondaryColor="#6a9b65"
        strokeWidth={4}
      />
    </div>
  );
};

export default LoadingSpinner;
