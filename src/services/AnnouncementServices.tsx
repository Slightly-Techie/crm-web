import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { AnnouncementDataResponse } from "@/types";
import useEndpoints from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useFetchAnnouncements(limit?: number): {
  isFetching: boolean;
  isFetchingError: boolean;
  Announcements: AnnouncementDataResponse[];
} {
  const { getAnnouncements } = useEndpoints();
  const {
    isLoading: isFetching,
    isError: isFetchingError,
    data: Announcements,
  } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => getAnnouncements(limit).then(({ data }) => data.items),
    refetchOnWindowFocus: false,
  });

  return { isFetching, isFetchingError, Announcements };
}

export function usePostAnnouncment() {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const { mutate: DeleteAnnouncement } = useMutation(
    async (id: number) => {
      const res = await axiosAuth.delete(`/api/v1/announcements/${id}`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["announcements"]);
      },
    }
  );

  const { mutate: createNewAnnouncement } = useMutation(
    async (data: Partial<AnnouncementDataResponse>) => {
      if (data.edited) {
        const res = await axiosAuth.put(
          `/api/v1/announcements/${data.id}`,
          data
        );
        return res.data;
      }
      const res = await axiosAuth.post("/api/v1/announcements/", data);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["announcements"]);
      },
    }
  );

  return { createNewAnnouncement, DeleteAnnouncement };
}
