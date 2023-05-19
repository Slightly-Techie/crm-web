import React from "react";

function Announcements() {
  return (
    <div className="scrollbar announcement h-[calc(100vh - 5rem)] ov  w-[24rem] sticky p-4   self-start top-[5rem]">
      <div className="bg-[#fff] rounded-lg border-solid border-[1px] border-[#c7c7c76a] p-4 mb-4">
        <h3 className="text-2xl font-semibold py-2">Announcements</h3>
        <section className="py-2 border-y-[1px] border-[#c7c7c76a] ">
          <h4 className="py-1 font-semibold">Techie Academy</h4>
          <p>
            Yes!!! That’s right. Techie Academy is now accepting students. Come
            and Learn from industry experts and get the solid foundation you
            need to start your career
          </p>
        </section>
        <section className="py-2 border-y-[1px] border-[#c7c7c76a] ">
          <h4 className="py-1 font-semibold">Talk on scalable Rust codey</h4>
          <p>
            This weekend we’ll have our very own Marvin Edem take us through on
            the importance of writing scalable code in-general and how to do it
            in Rust.
          </p>
        </section>
      </div>
      <div className="bg-[#fff] sticky top-0 border-solid border-[1px] border-[#c7c7c76a]">
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
          <h3 className="text-lg font-semibold">Elvis Something</h3>
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
