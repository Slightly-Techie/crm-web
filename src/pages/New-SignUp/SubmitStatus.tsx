import React from "react";
import { Status } from "./NewSignUp";
import FeedLoader from "../Feed/FeedLoader";

type StatusProp = {
  status: Status;
  message?: string;
};

const Error = ({ message }: { message?: string }) => {
  return (
    <div className="w-full h-full grid place-content-center p-2">
      <h1 className=" text-[2rem] lg:text-[3.5rem] text-[#000] dark:text-[#f3f1f7]   text-center font-medium">
        There was an <mark className="text-[#ff7676]">error</mark> submitting
        your request{" "}
      </h1>
      {message && (
        <p className="text-[1.2rem] text-[#000] dark:text-[#f3f1f7] text-center ">
          {message}
        </p>
      )}
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

const Loader = () => {
  return (
    <div className="w-full h-full grid place-content-center p-2 overflow-hidden">
      <FeedLoader />
    </div>
  );
};

function SubmitStatus({ status, message }: StatusProp) {
  if (status === "error") return <Error message={message} />;
  if (status === "onsubmit") return <Loader />;
  if (status === "success") return <Success />;

  return null;
}

export default SubmitStatus;
