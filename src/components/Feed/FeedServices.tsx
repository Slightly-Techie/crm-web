import useAxiosAuth from "../../hooks/useAxiosAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { IPost } from "@/types";
import useEndpoints from "@/services";

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
    }
  );

  return { createNewPost };
}
