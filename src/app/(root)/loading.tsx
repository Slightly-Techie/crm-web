import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-full p-4 md:p-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-8 w-56 rounded-lg bg-surface-container-high" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 rounded-xl bg-surface-container-high" />
          <div className="h-28 rounded-xl bg-surface-container-high" />
          <div className="h-28 rounded-xl bg-surface-container-high" />
        </div>
        <div className="h-64 rounded-xl bg-surface-container-high" />
      </div>
    </div>
  );
};

export default Loading;
