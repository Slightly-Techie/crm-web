import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { AnnouncementDataResponse } from "@/types";
import useEndpoints from "@/services";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        toast.success("Announcement deleted successfully.");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "Failed to delete announcement. Please try again.";
        toast.error(message);
      },
    }
  );

  const { mutate: createNewAnnouncement } = useMutation(
    async (data: Partial<AnnouncementDataResponse>) => {
      // Check if editing based on presence of id
      if (data.id) {
        // For PUT, only send the fields the backend expects
        const updateData = {
          title: data.title,
          content: data.content,
          image_url: data.image_url,
        };
        const res = await axiosAuth.put(
          `/api/v1/announcements/${data.id}`,
          updateData
        );
        return res.data;
      }
      // For POST, send only the fields the backend expects
      const createData = {
        title: data.title,
        content: data.content,
        image_url: data.image_url,
      };
      const res = await axiosAuth.post("/api/v1/announcements/", createData);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to save announcement. Please try again.";
        toast.error(message);
      },
    }
  );

  return { createNewAnnouncement, DeleteAnnouncement };
}
