import React from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useMutation } from "@tanstack/react-query";
import { NewUserFields, Status } from "@/types";
import { AxiosError } from "axios";

function usePostNewSignUp() {
  const [status, setStatus] = React.useState<Status>("progress");
  const [errMessage, setErrMessage] = React.useState("");
  const axiosAuth = useAxiosAuth();

  const { mutate: createNewUser, error } = useMutation<
    void,
    any,
    Partial<NewUserFields>
  >(async (data) => {
    setStatus("onsubmit");
    try {
      const res = await axiosAuth.post("/api/v1/users/register", data);
      setStatus("success");
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ detail: string }>;
      setStatus("error");
      setErrMessage(err.response?.data.detail || "An error occured");
    }
  });

  return { createNewUser, status, setStatus, error, errMessage };
}

export default usePostNewSignUp;
