import useAxiosAuth from "../../hooks/useAxiosAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { IPost } from "@/types";
import useEndpoints from "@/services";
import { toast } from "react-hot-toast";

export function useFetchFeeds(): {
  isFetching: boolean;
  isFetchingError: boolean;
  FeedPosts: IPost[] | undefined;
} {
  const { getFeedPosts } = useEndpoints();
  const {
    isLoading: isFetching,
    isError: isFetchingError,
    data: FeedPosts,
  } = useQuery({
    queryKey: ["feed-data"],
    queryFn: () => getFeedPosts().then(({ data }) => data.items),
    refetchOnWindowFocus: false,
  });

  return { isFetching, isFetchingError, FeedPosts };
}

export function usePostFeeds() {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { mutate: createNewPost } = useMutation<
    Pick<IPost, "content" | "feed_pic_url">,
    any,
    FormData
  >(
    async (data) => {
      const res = await axiosAuth.post("/api/v1/feed/", data);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feed-data"]);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || "Failed to create post. Please try again.";
        toast.error(message);
      },
    }
  );

  return { createNewPost };
}
