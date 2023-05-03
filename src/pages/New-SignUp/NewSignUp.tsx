import React from "react";
import stars from "../../assets/icons/Stars.png";
import rocket from "../../assets/icons/big-blue-flying-rocket.png";

function NewSignUp() {
  return (
    <div className="w-screen h-screen grid grid-cols-2 bg-[#Fff] dark:bg-[#111111] ">
      <div className="new-sign-upbg  ">
        <div className="flex flex-col gap-4 justify-center p-8 w-4/5 mx-auto  h-full">
          <img src={stars} className=" w-36 object-contain h-8 " alt="stars" />
          <h1 className="text-[3.5rem] text-white font-bold ">
            Welcome to Slightly Techie Network
          </h1>
          <img
            className=" aspect-square w-20 object-contain "
            src={rocket}
            alt="rocket"
          />
        </div>
      </div>
      <div className=" p-8 w-5/6 mx-auto h-4/5 my-auto flex flex-col gap-4 ">
        <section className="flex mx-auto text-[1.5rem] font-medium justify-between">
          <h3>Profile</h3>
        </section>
        <section>
          <form>
            <div className=" my-4">
              <label htmlFor="">Email</label>
              <input
                className="w-full border-b-[1px]  border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
                type="text"
                placeholder="kofi@example.com"
              />
            </div>
            <div className="my-4">
              <label htmlFor="">Phone Number</label>
              <input
                className="w-full border-b-[1px] border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
                type="text"
              />
            </div>
            <div className="my-4">
              <label htmlFor="">Password</label>
              <input
                className="w-full border-b-[1px] border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
                type="text"
                placeholder="What type of techie are you?"
              />
            </div>
          </form>
        </section>
        <section className="flex gap-4 justify-end">
          <button className=" px-6 py-3 bg-[#001] text-white rounded-md">
            Back
          </button>
          <button className=" px-6 py-3 bg-[#001] text-white rounded-md">
            Next
          </button>
        </section>
      </div>
    </div>
  );
}

export default NewSignUp;
