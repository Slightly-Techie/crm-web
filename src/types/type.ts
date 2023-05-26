import { Dispatch, SetStateAction } from "react";

export interface MemberProps {
  data: IMember;
}

export interface IMember {
  id: number;
  name: string;
  location: string;
  work_exprerience: string[];
  stack: string[];
  profile_image: string;
}

export type WithoutNullableKeys<Type> = {
  [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>;
};

export type userProfile = {
  email: string;
  first_name: string;
  last_name: string;
  github_profile: string | null;
  twitter_profile: string | null;
  linkedin_profile: string | null;
  portfolio_url: string | null;
  profile_pic_url: string | null;
  id: number;
};

export interface NavbarProps {
  isOpen: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

// New user signup form types

export type TNewUserFields = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation: string;
  portfolio: string;
  bio: string;
  phone_number: string;
  years_of_experience: number | null;
  github_profile: string;
  twitter_profile: string;
  linkedin_profile: string;
  portfolio_url: string;
  stack: string;
  profile_pic_url: string;
  is_active: boolean;
  role_id?: number;
};

export type PostDataTypes = {
  content: string;
  feed_pic_url: string;
  id: string;
  created_at?: string;
  user: {
    first_name: string;
    last_name: string;
    profile_pic_url: string;
    id?: string;
  };
};
