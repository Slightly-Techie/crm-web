import { createColumnHelper } from "@tanstack/react-table";
type Applicant = {
  name: string;
  email: string;
  phone_number: string;
  years_of_experience: string;
  actions: any;
};

const columnHelper = createColumnHelper<Applicant>();

export const ApplicantsTableColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("phone_number", {
    header: "Phone Number",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("years_of_experience", {
    header: "Years Of Experience",
    cell: (info) => info.getValue(),
  }),
];
