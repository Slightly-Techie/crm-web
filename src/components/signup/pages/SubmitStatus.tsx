import React, { SVGProps } from "react";
import CheckIcon from "@/assets/icons/check-icon.svg";
import { formatDate } from "@/utils";
import { Status } from "@/types";
import LoadingSpinner from "@/components/loadingSpinner";
import Image from "next/image";

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
    <div className="w-full h-full flex text-black dark:text-white items-center justify-center p-4 md:w-[35rem] font-tt-hoves mx-auto">
      <div className="w-full md:w-96 flex flex-col border border-[#757575] rounded-md p-4">
        <h1 className="text-2xl py-2 text-[#000] dark:text-[#f3f1f7] text-center font-medium">
          There was an <mark className="text-[#ff7676] bg-none">error</mark>{" "}
          submitting your request{" "}
        </h1>
        <div className="w-full h-full grid place-content-center p-2">
          {message && (
            <p className="text-base text-[#000] dark:text-[#f3f1f7] text-center ">
              {message}
            </p>
          )}
        </div>
        <button
          className=" border  w-fit mx-auto px-4 py-1 rounded-md"
          type="button"
          onClick={resetForm}
        >
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
    <div className="w-full h-full flex items-center justify-center text-black dark:text-white p-8 xl:w-[40rem]  font-tt-hoves mx-auto">
      <div className="relative w-full flex flex-col gap-4 px-4">
        <div className="flex flex-col gap-1 items-center text-center md:text-start md:items-start">
          <h3 className="text-black dark:text-white  py-4 text-3xl md:text-4xl lg:text-5xl font-semibold">
            You are the real <mark className=" text-green-500">MVP</mark>,{" "}
            {name}!
          </h3>
          <h3 className="text-[#777] text-4xl">Thank you for signing up. 🎉</h3>
        </div>
        <div>
          <p className="text-black dark:text-white text-2xl">
            Your application is being reviewed
          </p>
          <p className="text-[#777] text-sm mt-1">
            We are currently reviewing your account information and will get in
            touch with you shortly. In the meantime, keep an eye on your email
            inbox. We&apos;ll be sending you an email with the next steps to
            join the network.
          </p>
          <div className="w-full h-28 flex flex-row border-t border-black/80 dark:border-[#D4D1D180] mt-3 border-dashed py-4">
            <div className="w-10 h-full">
              <Image src={CheckIcon} alt="check-icon" />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-[15px]">Application Submitted</p>
              <p className="text-sm text-[#757575]">{formattedDate}</p>
              <p className="text-black dark:text-white/80 text-sm">
                We&apos;re reviewing your account information.{" "}
              </p>
            </div>
          </div>
          <div className="w-full h-28 flex flex-row items-center border-black/80 dark:border-[#D4D1D180] border-dashed py-4">
            <div className="w-10">
              <PendingIcon className="dark:invert" />
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
      <LoadingSpinner />
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

const PendingIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={31}
    fill="none"
    {...props}
  >
    <g filter="url(#a)">
      <circle cx={15} cy={11.5} r={11} fill="#000" />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m10.723 11.718 2.906 2.837 6.26-6.11"
      />
    </g>
    <defs>
      <filter
        id="a"
        width={30}
        height={30}
        x={0}
        y={0.5}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_12_1556" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_12_1556"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
