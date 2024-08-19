"use client";
import React, { createContext, useContext, useState } from "react";
import { ProjectFields } from "@/types";

interface ProjectContextType {
  formValues: ProjectFields | null;
  setFormValues: (values: ProjectFields) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formValues, setFormValues] = useState<ProjectFields | null>(null);

  return (
    <ProjectContext.Provider value={{ formValues, setFormValues }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
