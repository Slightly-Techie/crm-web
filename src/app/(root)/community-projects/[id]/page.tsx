import TeamSection from "@/components/community-projects/teamSection";
import useEndpoints from "@/services";
import React from "react";

export default async function ProjectDetails({
  params,
}: {
  params: { id: string };
}) {
  const { getProject } = useEndpoints(true).projects;

  const project = await getProject(params.id);

  return (
    <main>
      <header className="border-b border-b-neutral-700 sticky top-0 bg-primary-light dark:bg-[#141414] w-full p-5">
        <h1 className="lg:text-2xl font-bold">{project.name}</h1>
      </header>
      <section className="p-8">
        <div className="md:w-[700px] flex flex-col gap-5  mx-auto">
          <h2 className="text-xl uppercase font-bold text-[#C9C9C9]">
            project description
          </h2>
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-2.5">
              <p className="text-sm uppercase font-semibold text-[#777777]">
                about
              </p>
              <p>{project.description}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="text-sm uppercase font-semibold text-[#777777]">
                Project Status
              </p>
              <div className="rounded-full px-3 py-1.5 bg-[#BDAA00] text-sm w-fit">
                <p>In Progress</p>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="text-sm uppercase font-semibold text-[#777777]">
                Project Type & Priority
              </p>
              <div className="flex flex-row gap-2.5">
                <div className="rounded-full px-3 py-1.5 bg-[#9747FF] text-sm w-fit">
                  <p>{project.project_type}</p>
                </div>
                <div className="rounded-full px-3 py-1.5 bg-[#F36901] text-sm w-fit">
                  <p>{project.project_priority}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="text-sm uppercase font-semibold text-[#777777]">
                Stack
              </p>
              <div className="flex flex-row gap-2.5">
                {project.project_tools.map((tool, i) => (
                  <div
                    key={`${tool}-${i}`}
                    className="rounded-md px-3 py-1.5 bg-white text-black text-sm w-fit"
                  >
                    <p>{tool}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <h2 className="text-xl uppercase font-bold text-[#C9C9C9]">TEAM</h2>
          <TeamSection />
        </div>
      </section>
    </main>
  );
}
