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
