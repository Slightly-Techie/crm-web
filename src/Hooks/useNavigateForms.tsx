import React from "react";

export type NewSignUpForm = {
  heading: "Profile" | "Skills" | "Social";
  element: JSX.Element;
}[];

function useNavigateForms(Forms: NewSignUpForm) {
  const [currentFormIndex, setCurrentFormIndex] = React.useState(0);
  const currentForm = Forms[currentFormIndex];

  const nextForm = () => {
    if (currentFormIndex === Forms.length - 1) return null;
    setCurrentFormIndex((prev) => prev + 1);
  };

  const previousForm = () => {
    if (currentFormIndex === 0) return null;
    setCurrentFormIndex((prev) => prev - 1);
  };
  return { currentForm, nextForm, previousForm, currentFormIndex };
}

export default useNavigateForms;
