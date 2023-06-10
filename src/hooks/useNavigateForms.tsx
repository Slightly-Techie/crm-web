import React from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
const Skills = dynamic(() => import("@/components/signup/pages/Skills"), {
  ssr: false,
});
const Social = dynamic(() => import("@/components/signup/pages/Social"), {
  ssr: false,
});
const CreatePassword = dynamic(
  () => import("@/components/signup/pages/CreatePassword"),
  { ssr: false }
);
const Profile = dynamic(() => import("@/components/signup/pages/Profile"), {
  ssr: false,
});

function useNavigateForms() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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
    {
      category: "Create Password",
      element: (
        <CreatePassword register={register} errors={errors} watch={watch} />
      ),
    },
  ];

  const currentForm = Forms[currentFormIndex];

  const next = () => {
    if (currentFormIndex === 3) return;
    setCurrentFormIndex((prev) => prev + 1);
  };

  const previous = () => {
    if (currentFormIndex === 0) return;
    setCurrentFormIndex((prev) => prev - 1);
  };

  const resetForm = () => {
    setCurrentFormIndex(0);
  };

  return {
    next,
    previous,
    resetForm,
    currentForm,
    handleSubmit,
    currentFormIndex,
  };
}

export default useNavigateForms;
