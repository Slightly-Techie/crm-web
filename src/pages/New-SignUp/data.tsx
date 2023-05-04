import Profile from "./Profile";
import Skills from "./Skills";
import Social from "./Social";
import { NewSignUpForm } from "../../Hooks/useNavigateForms";

export const NewSignUpFormData: NewSignUpForm = [
  {
    heading: "Profile",
    element: <Profile />,
  },
  {
    heading: "Skills",
    element: <Skills />,
  },
  {
    heading: "Social",
    element: <Social />,
  },
];
