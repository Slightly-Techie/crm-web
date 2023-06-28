import { NewUserFields } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const REGEXVALIDATION = {
  name: /^[a-zA-Z]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password:
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phoneNumberSingle: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  phoneNumberMultiple:
    /^(?:(?:[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6})(?:\/|$)){1,7}$/,
  twitter: /^(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}\/?$/,
  linkedIn:
    /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/(in|pub|company)\/[\w-]+\/?$/,
  shouldNotBeEmptyString: /^\s*\S.*\S\s*$/,
};

export let NEW_USER_DATA: NewUserFields = {
  first_name: "",
  last_name: "",
  password: "",
  password_confirmation: "",
  email: "",
  phone_number: "",
  stack: "",
  stack_id: 1,
  years_of_experience: null,
  bio: "",
  twitter_profile: "",
  linkedin_profile: "",
  github_profile: "",
  portfolio_url: "",
  is_active: false,
  profile_pic_url: "",
};
