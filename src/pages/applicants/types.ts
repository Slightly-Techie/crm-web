export type ApplicantProfile = {
  email: string;
  first_name: string;
  last_name: string;
  years_of_experience: string | number | null;
  bio: string | null;
  phone_number: string | null;
  github_profile: string | null;
  twitter_profile: string | null;
  linkedin_profile: string | null;
  portfolio_url: string | null;
  profile_pic_url: string | null;
  id: number;
  is_active: boolean;
};
