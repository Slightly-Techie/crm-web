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
