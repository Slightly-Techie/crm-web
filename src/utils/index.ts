export const getLocalToken = () => {
  const token = localStorage.getItem("st-token");

  return token === null ? undefined : token;
};
