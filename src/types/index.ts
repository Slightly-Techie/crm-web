export type Status = "onsubmit" | "success" | "error" | "progress";

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