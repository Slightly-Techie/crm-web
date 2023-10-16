"use client";
import { useState } from "react";
import Search from "@/assets/icons/search.png";
import StatusCheck from "@/components/projects/StatusCheck";

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
    <main>
      <section className="border-b w-full p-5">
        <p className="lg:text-xl font-bold">Community Projects</p>
      </section>
      <section className="flex justify-between items-center w-full my-2 p-5">
        <section className="w-[70%] flex items-center py-2 px-3 gap-2 border rounded-md">
          <input
            type="text"
            className="w-full bg-transparent border-none placeholder-st-gray-500 text-black dark:text-white focus:outline-none"
            placeholder="Search by keyword"
          />
          <img src={Search.src} alt="search icon" />
        </section>
        {isAdmin && (
          <button className="bg-[#090909] px-4 py-2 rounded text-sm">
            Add Project
          </button>
        )}
      </section>
      <section className="p-5">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Project name
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Team Members
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((item) => {
                return (
                  <tr key={item.id} className="bg-[#121212] border-b w-full">
                    <td className="px-6 py-3">{item.title}</td>
                    <td className="px-6 py-3">
                      <StatusCheck status="In Progress" />
                    </td>
                    <td className="px-6 py-3">{item.project_lead}</td>
                    <td className="px-6 py-3">{item.team_members}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Page;
