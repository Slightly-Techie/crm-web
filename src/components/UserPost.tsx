import React from "react";

function UserPost() {
  return (
    <div className="border-b-[#c7c7c76a] border-b-[1px] pb-4">
      <section className="flex gap-4 p-4">
        <div className="w-12 aspect-square rounded-full overflow-hidden ">
          <img
            src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            alt="Profile"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div>
          <h3 className=" text-lg font-semibold">Brian Newton</h3>
          <p className="text-sm font-light">@briannewton</p>
        </div>
      </section>
      <section>
        <p>
          And even then, your lowest days when you no longer Superman At least
          you know you got Lois Lane But you... Run away, run away, run away,
          run away
        </p>
      </section>
    </div>
  );
}

export default UserPost;
