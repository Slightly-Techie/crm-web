import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ITechie } from "@/types";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "react-hot-toast";
import useEndpoints from "@/services";
import useDebouncedSearch from "./useDebouncedSearch";

interface AllUsersResponse {
  items: ITechie[];
  total: number;
  size: number;
  page: number;
  pages: number;
}

export function useApplicantHooks() {
  const [users, setUsers] = useState<undefined | ITechie[]>();
  const [currentUser, setCurrentUser] = useState<number>();
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const authAxios = useAxiosAuth();
  const queryClient = useQueryClient();
  const { searchApplicant } = useEndpoints();
  const { debounce, result } = useDebouncedSearch(searchApplicant, 400);
  const query = useQuery({
    queryKey: ["allUsers"],
    queryFn: () =>
      authAxios.get<AllUsersResponse>(
        `/api/v1/users/?active=false&page=${page}&size=50`
      ),
    onSuccess(res) {
      setUsers(res.data?.items);
      setPages(res?.data?.pages);
    },
  });

  const newData = filter && result?.items ? result.items : users;

  const isLoading = query.isLoading;

  const mutation = useMutation({
    mutationFn: (userId: number) => {
      setCurrentUser(userId);
      return authAxios.put(`/api/v1/users/profile/${userId}/activate`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onSuccess: () => {
      const user = newData?.find((user) => user.id === currentUser);
      toast.success(`${user?.first_name}'s account has been activated!`);
    },
  });

  const handleFilter = (value: string) => {
    setFilter(value);
    debounce(value);
  };

  useEffect(() => {
    query.refetch();
  }, [page, query]);

  const tableData = newData?.map(
    ({
      first_name,
      last_name,
      email,
      years_of_experience,
      phone_number,
      status,
      id,
    }) => {
      return {
        name: first_name + " " + last_name,
        email: email,
        phone_number: phone_number || "N / A",
        years_of_experience: years_of_experience?.toString() || "N / A",
        id: id,
        status,
      };
    }
  );

  return {
    tableData,
    users,
    mutation,
    query,
    filter,
    newData,
    setPage,
    page,
    pages,
    isLoading,
    handleFilter,
  };
}
