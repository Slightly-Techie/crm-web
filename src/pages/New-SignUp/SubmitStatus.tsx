import React from "react";
import { Status } from "./NewSignUp";
import { Oval } from "react-loader-spinner";
type StatusProp = {
  status?: Status;
};

const Error = () => {
  return (
    <div className="w-full h-full grid place-content-center p-2">
      <h1 className=" text-[2rem] lg:text-[3.5rem] text-[#000] dark:text-[#f3f1f7]   text-center font-medium">
        The was an <mark className="text-[#ff7676]">error</mark> submitting your
        request{" "}
      </h1>
      <p className="text-[#333] dark:text-white text-center ">
        Please try again.
      </p>
    </div>
  );
};
const Success = () => {
  return (
    <div className="w-full h-full grid place-content-center p-2">
      <h1 className=" text-[2rem] lg:text-[3.5rem] text-[#000] dark:text-[#f3f1f7]   text-center font-medium">
        Your application has been submitted{" "}
        <mark className="text-[#3bffa3]">successfully!</mark>
      </h1>
    </div>
  );
};

const Submit = () => {
  return (
    <div className="w-full h-full grid place-content-center p-2">
      <Oval />
    </div>
  );
};

function SubmitStatus({ status }: StatusProp) {
  if (status === "error") return <Error />;
  if (status === "onsubmit") return <Submit />;
  if (status === "success") return <Success />;

  return null;
}

export default SubmitStatus;
