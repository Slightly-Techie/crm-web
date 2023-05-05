import React from "react";
import { useForm } from "react-hook-form";
import Profile from "../pages/New-SignUp/Profile";
import Skills from "../pages/New-SignUp/Skills";
import Social from "../pages/New-SignUp/Social";

function useNavigateForms() {
  const { register, handleSubmit } = useForm();
  const [currentFormIndex, setCurrentFormIndex] = React.useState(0);
  const Forms = [
    {
      category: "Profile",
      element: <Profile register={register} />,
    },
    {
      category: "Profile",
      element: <Skills register={register} />,
    },
    {
      category: "Profile",
      element: <Social register={register} />,
    },
  ];

  const currentForm = Forms[currentFormIndex];

  const next = () => {
    if (currentFormIndex === 2) return null;
    setCurrentFormIndex((prev) => prev + 1);
  };

  const previous = () => {
    if (currentFormIndex === 0) return null;
    setCurrentFormIndex((prev) => prev - 1);
  };
  return { next, previous, currentForm, handleSubmit, currentFormIndex };
}

export default useNavigateForms;
