import React from "react";

function Profile() {
  return (
    <>
      <div className=" my-4">
        <label className="text-[#000] dark:text-[#fff]" htmlFor="">
          Email
        </label>
        <input
          className="w-full border-b-[1px]  text-[#000] dark:text-white border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
          type="text"
          placeholder="kofi@example.com"
        />
      </div>
      <div className="my-4">
        <label className="text-[#000] dark:text-white" htmlFor="">
          Phone Number
        </label>
        <input
          className=" text-[#000] dark:text-white w-full border-b-[1px] border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
          type="text"
        />
      </div>
      <div className="my-4">
        <label className="text-[#000] dark:text-white" htmlFor="">
          What type of techie are you?
        </label>
        <select className="w-full mt-4 border-b-[1px] text-[#000] dark:text-white border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]">
          <option value="Backend">Backend</option>
          <option value="Fronted">Frontend</option>
          <option value="Full Stack">Full Stack</option>
          <option value="UI/UX">UI/UX</option>
          <option value="Mobile">Mobile</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {/* <div className="my-4">
            <label className="text-[#000] dark:text-white" htmlFor="">
            If Other above, please specify
            </label>
            <input
            className="w-full border-b-[1px] text-[#000] dark:text-white border-b-[#33333380] disabled:border-b-[#33333357] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
            type="text"
            disabled
            />
          </div> */}
    </>
  );
}

export default Profile;
