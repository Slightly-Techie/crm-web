import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ITechie } from "@/types";
import useAxiosAuth from "./useAxiosAuth";

interface AllUsersResponse {
  users: ITechie[];
  total: number;
  size: number;
  page: number;
  pages: number;
}

export function useApplicantHooks() {
  const [users, setUsers] = useState<undefined | ITechie[]>();
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [newData, setNewData] = useState<undefined | ITechie[]>();
  const authAxios = useAxiosAuth();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["allUsers"],
    queryFn: () =>
      authAxios.get<AllUsersResponse>(`/api/v1/users/?limit=10&page=${page}`),
    onSuccess(res) {
      setUsers(res.data?.users);
      setPages(res?.data?.pages);
    },
  });

  // const isLoading = query.fetchStatus === "fetching";
  const isLoading = query.isLoading;

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
      }, 2000);
    },
  });

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(filter);
    }, 500);
    return () => clearTimeout(delayInputTimeoutId);
  }, [filter]);

  useEffect(() => {
    query.refetch();
  }, [page, query]);

  useEffect(() => {
    if (debouncedInputValue) {
      const filteredUserData = users?.filter(
        (user) =>
          user?.first_name
            .toLowerCase()
            .includes(debouncedInputValue.toLowerCase().trim()) ||
          user?.last_name
            .toLowerCase()
            .includes(debouncedInputValue.toLowerCase().trim()) ||
          user?.email
            .toLowerCase()
            .includes(debouncedInputValue.toLowerCase().trim())
      );
      setNewData(filteredUserData);
    } else {
      setNewData(users);
    }
  }, [debouncedInputValue, users]);

  const tableData = newData
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
          years_of_experience: years_of_experience?.toString() || "N / A",
          id: id,
        };
      }
    );

  return {
    tableData,
    users,
    mutation,
    message,
    query,
    filter,
    setFilter,
    newData,
    setPage,
    page,
    pages,
    isLoading,
  };
}
