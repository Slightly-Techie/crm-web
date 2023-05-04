import React from "react";

function Skills() {
  return (
    <>
      <section className="flex text-[#000] dark:text-white mx-auto text-[1.5rem] font-medium justify-between">
        <h3>Skills</h3>
      </section>
      <section>
        <form>
          <div className=" my-4">
            <label className=" text-[#000] dark:text-white" htmlFor="">
              List all the languages/technologies you use.
            </label>
            <input
              className="w-full text-[#000] dark:text-white border-b-[1px]  border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
              type="text"
              placeholder="Eg. JavaScript, NextJs, Ruby"
            />
          </div>
          <div className="my-4">
            <label className=" text-[#000] dark:text-white" htmlFor="">
              Years of experience
            </label>
            <input
              className="w-full text-[#000] dark:text-white border-b-[1px] border-b-[#33333380] input__transparent py-2 focus:outline-none focus:border-b-[1px] focus:border-b-[#333]"
              type="text"
            />
          </div>
          <div className="my-4">
            <label className=" text-[#000] dark:text-white" htmlFor="">
              Write a summary about your experience so far
            </label>
            <textarea
              cols={30}
              rows={3}
              className="w-full text-[#000] dark:text-white my-4 border-[1px] px-2 py-2 border-[#3333337c] dark:bg-[transparent] focus:outline-none focus:border-[#333]"
            />
          </div>
        </form>
      </section>
    </>
  );
}

export default Skills;
