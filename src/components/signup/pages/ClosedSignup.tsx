import React from "react";
import { HiCheckCircle } from "react-icons/hi2";
import LinePng from "../../../assets/icons/Vector-27.png";
import Image from "next/image";
import { formatDate } from "@/utils";

const ClosedSignup = () => {
  const date = new Date(); // Current date
  const formattedDate = formatDate(date);
  return (
    <div className="w-full h-full flex items-center justify-center text-black dark:text-white p-8 md:w-[35rem] font-tt-hoves mx-auto">
      <div className="relative w-full flex flex-col gap-6">
        <div className="flex flex-col gap-1 text-3xl md:text-4xl items-center text-center md:text-start md:items-start">
          <h3 className="text-black dark:text-white font-semibold pb-10">
            HeyThere!👋
          </h3>
          <h3 className="text-[#777] pb-2">
            We appreciate your interest in joining our organization.
          </h3>
        </div>
        <div className="">
          <p className="text-black dark:text-white text-2xl font-medium mb-4">
            Right now, applications are taking little break
          </p>
          <p className="text-[#777] dark:font-medium text-lg">
            Don&apos;t worry though, we&apos;re constantly cooking up exciting
            opportunities! Keep an eye on our{" "}
            <a
              href="https://twitter.com/_slightlyTechie"
              className="text-[#FBBC04]"
            >
              twitter page
            </a>{" "}
            and our{" "}
            <a
              href="https://app.slightlytechie.com/"
              className="text-[#FBBC04]"
            >
              official website{" "}
            </a>
            for updates on when applications will swing back open. We can&apos;t
            wait to welcome you aboard.
          </p>
          <div className="mt-3">
            <Image src={LinePng} alt="line-png" />
          </div>
          <div className="flex flex-row gap-4 mt-3">
            <HiCheckCircle size={20} className="text-[#FF6D64]" />
            <div className=" ">
              <p className="text">Application Closed</p>
              <p className="text-[#777] text-">{formattedDate}</p>
              <p className="text-">Thank you for being awesome!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosedSignup;
