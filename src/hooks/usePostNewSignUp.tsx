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
  detail: string | ErrorObj[] | Record<string, unknown>;
};

function usePostNewSignUp() {
  const [status, setStatus] = React.useState<Status>("progress");
  const [errMessage, setErrMessage] = React.useState("");
  const axiosAuth = useAxiosAuth();

  const toReadableMessage = (detail: unknown): string => {
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      const first = detail[0];
      if (first?.msg) {
        const errField = first?.loc?.[1] || first?.loc?.[0] || "field";
        return `${errField}: ${first.msg}`;
      }
      return "Validation failed. Please check your inputs.";
    }
    if (detail && typeof detail === "object") {
      return "Request failed. Please check your inputs and try again.";
    }
    return "An error occurred";
  };

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
      const err = errorObj as AxiosError;
      const error = err as AxiosError<BadRequest | ResponseError>;
      const detail = error.response?.data?.detail;
      const errMsg = toReadableMessage(detail);
      setStatus("error");
      setErrMessage(errMsg || "An error occurred");
    }
  });

  return { createNewUser, status, setStatus, error, errMessage };
}

export default usePostNewSignUp;
