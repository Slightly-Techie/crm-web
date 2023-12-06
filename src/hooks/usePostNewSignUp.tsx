import React from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useMutation } from "@tanstack/react-query";
import { NewUserFields, Status } from "@/types";
import { AxiosError } from "axios";

type ErrorObj = {
  loc: string[];
  msg: string;
  type: string;
};

type ResponseError = {
  detail: ErrorObj[];
};

type BadRequest = {
  detail: string;
};

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
    } catch (errorObj) {
      let errMsg: string;
      const err = errorObj as AxiosError;
      if (err.response?.status === 400) {
        const error = err as AxiosError<BadRequest>;
        errMsg = error.response?.data.detail as string;
      } else {
        const error = errorObj as AxiosError<ResponseError>;
        const errObj = error.response?.data.detail[0];
        const errField = errObj?.loc[1] || "";
        errMsg = `${errField}: ${errObj?.msg}`;
      }
      setStatus("error");
      setErrMessage(errMsg || "An error occured");
    }
  });

  return { createNewUser, status, setStatus, error, errMessage };
}

export default usePostNewSignUp;
