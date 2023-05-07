import React from "react";

function SubmitSuccess() {
  return (
    <div className="w-full h-full grid place-content-center p-2">
      <h1 className=" text-[2rem] lg:text-[3.5rem] text-[#000] dark:text-[#f3f1f7]   text-center font-medium">
        Your application has been submitted{" "}
        <mark className="text-[#3bffa3]">successfully!</mark>
      </h1>
      {/* <p className="text-center">
        Expect a feedback from us. Kindly check your email regularly.
      </p> */}
    </div>
  );
}

export default SubmitSuccess;
