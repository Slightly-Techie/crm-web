import React from "react";
import { RiCloseLine } from "react-icons/ri";

type LeaderboardProps = {
  show: boolean;
  toggleScoreboard: () => void;
};

function Announcements({ show, toggleScoreboard }: LeaderboardProps) {
  return (
    <div
      className={`w-screen ${
        show ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0 p-4 overflow-y-scroll fixed top-0 h-screen scrollbar lg:h-[calc(100vh-5rem)] bg-[#fff] dark:bg-[#000] z-[100] lg:z-10 lg:w-[24rem] lg:sticky self-start lg:top-[5rem]`}
    >
      <button
        onClick={toggleScoreboard}
        className=" dark:text-white text-[#010101] lg:hidden block ml-auto"
      >
        <RiCloseLine color=" inherit" size={24} />
      </button>
      <div className="bg-[#fff] dark:bg-[#000] dark:text-st-gray200 rounded-lg border-solid border-[1px] border-[#c7c7c73b] dark:border-none p-4 mb-4">
        <h3 className="text-2xl font-semibold py-2">Announcements</h3>
        <section className="py-2 border-y-[1px] border-[#c7c7c73b] ">
          <h4 className="py-1 font-semibold">Techie Academy</h4>
          <p>
            Yes!!! That’s right. Techie Academy is now accepting students. Come
            and Learn from industry experts and get the solid foundation you
            need to start your career
          </p>
        </section>
        <section className="py-2 border-y-[1px] border-[#c7c7c73b] ">
          <h4 className="py-1 font-semibold">Talk on scalable Rust codey</h4>
          <p>
            This weekend we’ll have our very own Marvin Edem take us through on
            the importance of writing scalable code in-general and how to do it
            in Rust.
          </p>
        </section>
      </div>
      <div className="bg-[#fff] dark:bg-[#000] dark:text-st-gray200 rounded-lg sticky top-0 border-solid border-[1px] border-[#c7c7c73b]">
        <h3 className=" text-xl font-semibold text-center py-2">
          {" "}
          Champion Techie for May
        </h3>
        <section className="w-full h-48 ">
          <img
            className="w-full h-full object-cover object-center"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
            alt=""
          />
        </section>
        <section className="p-4">
          <h3 className="text-lg font-semibold">Elvis DSA</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
            quisquam labore dolorum nisi? Cumque, laudantium?
          </p>
        </section>
      </div>
    </div>
  );
}

export default Announcements;
