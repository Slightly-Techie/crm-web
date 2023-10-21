import { Dispatch, SetStateAction } from "react";

export type WithoutNullableKeys<Type> = {
  [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>;
};

export type Status = "onsubmit" | "success" | "error" | "progress";

export interface TGetPaginatedResponse {
  total: number;
  page: number;
  size: number;
  pages: number;
  links: {
    first: string;
    last: string;
    self: string;
    next: string;
    prev: string;
  };
}

export interface IGetAllTechiesResponse extends TGetPaginatedResponse {
  users: ITechie[];
}

export enum UserStatusEnum {
  TO_CONTACT = "TO CONTACT",
  IN_REVIEW = "IN REVIEW",
  INTERVIEWED = "INTERVIEWED",
  ACCEPTED = "ACCEPTED",
  NO_SHOW = "NO SHOW",
  REJECTED = "REJECTED",
  TO_BE_ONBOARDED = "TO BE ONBOARDED",
  CONTACTED = "CONTACTED",
}

export interface ITechie {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  years_of_experience: number;
  bio: string;
  phone_number: string;
  github_profile: string | null;
  twitter_profile: string | null;
  linkedin_profile: string | null;
  portfolio_url: string | null;
  profile_pic_url: string | null;
  skills: ISkill[];
  tags: ITag[];
  stack: IStack | null;
  created_at: string;
  is_active: boolean;
  status?: keyof typeof UserStatusEnum;
}

export interface ISkill {
  id: number;
  name: string;
}

export interface ITag extends ISkill {}

export interface NavbarProps {
  isOpen: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export type NewUserFields = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation: string;
  bio: string;
  phone_number: string;
  years_of_experience: number | null;
  github_profile: string;
  twitter_profile: string;
  linkedin_profile: string;
  portfolio_url: string;
  stack_id: number;
  stack?: string;
  skills: string[];
  profile_pic_url: string;
  is_active: boolean;
  role_id?: number;
};

export interface IPost {
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
}

export interface IGetFeedsResponse {
  feeds: IPost[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface IStack {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
export type AnnouncementData = {
  title: string;
  content: string;
  edited?: boolean;
  image_url?: string;
};

export type AnnouncementDataResponse = AnnouncementData & {
  id: number;
};

export interface IStack {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
