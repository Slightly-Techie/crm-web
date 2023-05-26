import { useState } from "react";
import useEndpoints from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ApplicantProfile } from "./types";
import useAxiosAuth from "../../hooks/useAxiosAuth";

export function useApplicantHooks() {
  const { getAllUsers } = useEndpoints();
  const [users, setUsers] = useState<undefined | ApplicantProfile[]>();
  const [message, setMessage] = useState("");
  const authAxios = useAxiosAuth();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
    onSuccess(res) {
      setUsers(res.data);
    },
  });

  const mutation = useMutation({
    mutationFn: (userId: number) => {
      return authAxios.put(`/api/v1/users/profile/${userId}/activate`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onSuccess: () => {
      setMessage("Activation successful");
      setTimeout(() => {
        setMessage("");
      }, 600);
    },
  });

  const tableData = users
    ?.filter((user) => user?.is_active === false)
    .map(
      ({
        first_name,
        last_name,
        email,
        years_of_experience,
        phone_number,
        id,
      }) => {
        return {
          name: first_name + " " + last_name,
          email: email,
          phone_number: phone_number || "N / A",
          years_of_experience: years_of_experience || "N / A",
          id: id,
        };
      }
    );

  return { tableData, users, mutation, message };
}
