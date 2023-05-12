import React from "react";
import { useForm } from "react-hook-form";
import Profile from "../pages/New-SignUp/Profile";
import Skills from "../pages/New-SignUp/Skills";
import Social from "../pages/New-SignUp/Social";

function useNavigateForms() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  const [currentFormIndex, setCurrentFormIndex] = React.useState(0);
  const Forms = [
    {
      category: "Profile",
      element: <Profile register={register} errors={errors} />,
    },
    {
      category: "Skills",
      element: <Skills register={register} errors={errors} />,
    },
    {
      category: "Social",
      element: <Social register={register} errors={errors} />,
    },
  ];

  const currentForm = Forms[currentFormIndex];

  const next = () => {
    if (currentFormIndex === 2) return;
    setCurrentFormIndex((prev) => prev + 1);
  };

  const previous = () => {
    if (currentFormIndex === 0) return;
    setCurrentFormIndex((prev) => prev - 1);
  };
  return { next, previous, currentForm, handleSubmit, currentFormIndex };
}

export default useNavigateForms;
