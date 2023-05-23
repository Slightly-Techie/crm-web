export const Colors = {
  background: "#111111",
  Gray: {
    100: "#3A3A3A",
    200: "#282828",
    300: "#111111",
  },
};

export const API_URL = process.env.REACT_APP_API_URL;

export const REGEXVALIDATION = {
  name: /^[a-zA-Z]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
  phoneNumber: /^(?:\+233|0)[23567]\d{8}$|^(\+|0{2})\d{1,3}\d{4,14}$/,
  linkedIn:
    /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/(in|pub|company)\/[\w-]+\/?$/,
  twitter: /^(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}\/?$/,
};
