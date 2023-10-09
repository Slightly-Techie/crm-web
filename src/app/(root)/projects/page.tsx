"use client";
import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "ST CRM",
    about: "lorem50",
    size: "Medium",
    Priority: "Medium",
    project_lead: "@briannewton",
    team_members: ["Nana Kwasi Asante", "Bill Gates"],
  },
  {
    id: 2,
    title: "E-commerce Website Redesign",
    about: "lorem50",
    size: "Large",
    Priority: "High",
    project_lead: "@johndoe",
    team_members: ["Alice Johnson", "Steve Jobs"],
  },
  {
    id: 3,
    title: "Mobile App Development",
    about: "lorem50",
    size: "Small",
    Priority: "Low",
    project_lead: "@janedoe",
    team_members: ["Elon Musk", "Mark Zuckerberg"],
  },
  {
    id: 4,
    title: "Data Analytics Platform",
    about: "lorem50",
    size: "Extra Large",
    Priority: "High",
    project_lead: "@sarahsmith",
    team_members: ["Warren Buffett", "Larry Page"],
  },
];

// You can continue adding more projects as needed.

function Page() {
  const [isAdmin] = useState<boolean>(true);

  return (
    <main className="text-white py-5 px-5">
      <h1 className="font-bold text-2xl">Projects</h1>
      <section className="flex justify-between items-center w-full my-3">
        <input type="search" name="" id="" />
        {isAdmin && (
          <button className="bg-[#090909] px-4 py-2 rounded">Add/Edit</button>
        )}
      </section>
      <br />
      <section className="grid grid-cols-3 gap-5">
        {projects.map((project) => {
          return (
            <section
              key={project.id}
              className="col-span-3 lg:col-span-1 bg-[#090909] p-5 rounded"
            >
              <section>
                <h1>{project.title}</h1>
                <p>{project.about}</p>
                <section className="flex gap-5 my-3">
                  <p>Size: {project.size}</p>
                  <p>Priority: {project.Priority}</p>
                </section>
                <section>
                  <p>Project Lead: {project.project_lead}</p>
                </section>
              </section>
            </section>
          );
        })}
      </section>
    </main>
  );
}

export default Page;
