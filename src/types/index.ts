export type Status = "onsubmit" | "success" | "error" | "progress";

export interface ITechie {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  years_of_experience: number;
  bio: string;
  phone_number: string;
  github_profile: string;
  twitter_profile: string;
  linkedin_profile: string;
  portfolio_url: string;
  profile_pic_url: string;
  skills: ISkill[];
  tags: ITag[];
  created_at: string;
  is_active: boolean;
}

export interface ISkill {
  id: number;
  name: string;
}

export interface ITag extends ISkill {}

export type NewUserFields = {
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
