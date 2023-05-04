import React from "react";

function Social() {
  return (
    <>
      <section className="flex mx-auto text-[1.5rem] text-[#000] dark:text-white font-medium justify-between">
        <h3>Social</h3>
      </section>
      <section>
        <form>
          <div className=" my-4">
            <label className=" text-[#000] dark:text-white" htmlFor="">
              What's your Twitter handle?
            </label>
            <input
              className="w-full border-b-[1px] text-[#000] dark:text-white  border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
              type="text"
            />
          </div>
          <div className="my-4">
            <label className=" text-[#000] dark:text-white" htmlFor="">
              What's your linkedIn profile?
            </label>
            <input
              className="w-full text-[#000] dark:text-white border-b-[1px] border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
              type="text"
            />
          </div>
          <div className="my-4">
            <label className=" text-[#000] dark:text-white" htmlFor="">
              Are you currently working?
            </label>
            <section className="flex text-[#000] dark:text-white gap-4 my-4 ">
              <div className="">
                <input type="checkbox" className=" rounded-full" />
                <label className="mx-2 text-[#000] dark:text-white" htmlFor=" ">
                  Yes
                </label>
              </div>
              <div className="">
                <input type="checkbox" />
                <label className="mx-2 text-[#000] dark:text-white" htmlFor="">
                  No
                </label>
              </div>
            </section>
          </div>
        </form>
      </section>
    </>
  );
}

export default Social;
