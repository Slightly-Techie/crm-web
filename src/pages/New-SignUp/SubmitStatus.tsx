import React from "react";
import { Status } from "./NewSignUp";
import FeedLoader from "../Feed/FeedLoader";
import CheckIcon from "../../assets/icons/check-icon.svg";
import PendingIcon from "../../assets/icons/pending-icon.svg";
import { formatDate } from "../../utils";

type StatusProp = {
  status: Status;
  message?: string;
  resetForm: () => void;
};

const Error = ({
  message,
  resetForm,
}: {
  message?: string;
  resetForm: () => void;
}) => {
  return (
    <div className="w-full h-full flex text-black dark:text-white items-center justify-center p-8 md:w-[35rem] font-tt-hoves mx-auto">
      <div className="w-96 flex flex-col border border-[#757575] p-8">
        <h1 className="text-lg text-[#000] dark:text-[#f3f1f7] text-center font-medium">
          There was an <mark className="text-[#ff7676]">error</mark> submitting
          your request{" "}
        </h1>
        <div className="w-full h-full grid place-content-center p-2">
          {message && (
            <p className="text-[1.2rem] text-[#000] dark:text-[#f3f1f7] text-center ">
              {message}
            </p>
          )}
        </div>
        <button className="" type="button" onClick={resetForm}>
          Try Again
        </button>
      </div>
    </div>
  );
};
const Success = ({ name = "" }) => {
  const date = new Date(); // Current date
  const formattedDate = formatDate(date);

  return (
    <div className="w-full h-full flex items-center justify-center text-black dark:text-white p-8 md:w-[35rem] font-tt-hoves mx-auto">
      <div className="w-full flex flex-col gap-20">
        <div className="flex flex-col gap-1 text-3xl md:text-4xl items-center text-center md:text-start md:items-start">
          <h3 className="text-black dark:text-white">
            You are the real MVP, {name}!
          </h3>
          <h3 className="text-[#4CAF50]">Thank you for signing up. 🎉</h3>
        </div>
        <div>
          <p className="text-black dark:text-white text-xl">
            Your application is being reviewed
          </p>
          <p className="text-black dark:text-white text-sm mt-1">
            We are currently reviewing your account information and will get in
            touch with you shortly. In the meantime, keep an eye on your email
            inbox. We'll be sending you an email with the next steps to join the
            network.
          </p>
          <div className="w-full h-28 flex flex-row border-y border-black/80 dark:border-[#D4D1D180] mt-3 border-dashed py-4">
            <div className="w-10 h-full">
              <img src={CheckIcon} alt="check-icon" />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-[15px]">Application Submitted</p>
              <p className="text-sm text-[#757575]">{formattedDate}</p>
              <p className="text-black dark:text-white/80 text-sm">
                We’re reviewing your account information.{" "}
              </p>
            </div>
          </div>
          <div className="w-full h-28 flex flex-row items-center border-b border-black/80 dark:border-[#D4D1D180] border-dashed py-4">
            <div className="w-10">
              <img src={PendingIcon} alt="check-icon" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[15px]">Account Activation</p>
              <p className="text-sm text-[#757575]">Pending</p>
            </div>
          </div>
        </div>
      </div>
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

function SubmitStatus({ status, message, resetForm }: StatusProp) {
  if (status === "error")
    return <Error resetForm={resetForm} message={message} />;
  if (status === "onsubmit") return <Loader />;
  if (status === "success") return <Success name={message} />;

  return null;
}

export default SubmitStatus;
