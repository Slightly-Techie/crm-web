import React from "react";
import { RiCloseLine } from "react-icons/ri";

type LeaderboardProps = {
  show: boolean;
  toggleScoreboard: () => void;
};

function Leaderboard({ show, toggleScoreboard }: LeaderboardProps) {
  return (
    <div
      className={`w-screen ${
        show ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 p-4 fixed top-0 h-screen bg-[#fff] dark:bg-[#000] z-[100] lg:h-fit lg:z-10 lg:w-[24rem] lg:sticky self-start lg:top-[5rem] `}
    >
      <button
        onClick={toggleScoreboard}
        className=" dark:text-white text-[#010101] lg:hidden block ml-auto"
      >
        <RiCloseLine color=" inherit" size={24} />
      </button>
      <div className="bg-[#fff] lg:relative  dark:bg-[#010101] rounded-lg border-solid border-[1px] dark:border-none border-[#c7c7c73b] p-4 ">
        <h1 className=" text-2xl font-semibold text-center dark:text-st-gray200 ">
          Techie Leaderboard
        </h1>
        <ul className="w-full">
          <li className="p-4 border-[1px] bg-[#fafafaf4] dark:bg-[#272727b5] dark:text-st-gray200 border-[#c7c7c73b] rounded-md mt-4 flex justify-around items-center ">
            <div className="w-24 aspect-square overflow-x-hidden rounded-full">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                alt="Profile"
              />
            </div>
            <div>
              <h2 className=" text-xl ">Brian Newton</h2>
              <p className="text-[#b4b4b4dc]">@briannewton</p>
            </div>
          </li>
          <li className="px-4 py-1 flex justify-between  border-solid border-[1px] dark:bg-[#272727b5] dark:text-st-gray200 border-[#c7c7c73b] bg-[#fafafaf4] items-center rounded-md mt-4">
            <div className="w-12 aspect-square overflow-x-hidden rounded-full">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                alt="Profile"
              />
            </div>
            <span>Addo Diabene </span>
            <span className=" py-1 px-3 rounded-sm bg-[#9a42ff] text-sm text-white">
              2ND
            </span>
          </li>
          <li className="px-4 py-1 flex   border-solid border-[1px] dark:bg-[#272727b5] dark:text-st-gray200 border-[#c7c7c73b] justify-between bg-[#fafafaf4] items-center rounded-md mt-4">
            <div className="w-12 aspect-square overflow-x-hidden rounded-full">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                alt="Profile"
              />
            </div>
            <span>Greatness Mensah </span>
            <span className=" py-1 px-3 rounded-sm bg-[#d1a0ff] text-white text-sm">
              3RD
            </span>
          </li>
          <li className="px-4 py-1 flex   border-solid border-[1px] dark:bg-[#272727b5] dark:text-st-gray200 border-[#c7c7c73b] justify-between bg-[#fafafaf4] items-center rounded-md mt-4">
            <div className="w-12 aspect-square overflow-x-hidden rounded-full">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1570158268183-d296b2892211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                alt="Profile"
              />
            </div>
            <span>Emmanuel Sane</span>
            <span className=" py-1 px-3 rounded-sm border-solid border-[1px] border-[#c7c7c73b] text-sm">
              4TH
            </span>
          </li>
          <li className="px-4 py-1 flex  border-solid border-[1px] dark:bg-[#272727b5] dark:text-st-gray200 border-[#c7c7c73b] justify-between  bg-[#fafafaf4] items-center rounded-md mt-4">
            <div className="w-12 aspect-square overflow-x-hidden rounded-full">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                alt="Profile"
              />
            </div>
            <span>Jerry Elikem</span>
            <span className=" py-1 px-3 border-solid border-[1px] border-[#c7c7c73b]  rounded-sm  text-sm">
              5TH
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Leaderboard;
