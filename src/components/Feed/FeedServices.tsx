import useAxiosAuth from "../../hooks/useAxiosAuth";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { IPost } from "@/types";

export function useFetchFeeds(): {
  isFetching: boolean;
  isFetchingError: boolean;
  FeedPosts: IPost[] | undefined;
} {
  const authAxios = useAxiosAuth();
  const {
    isLoading: isFetching,
    isError: isFetchingError,
    data: FeedPosts,
  } = useQuery(
    "feed-data",
    async (): Promise<IPost[]> => {
      const res = await authAxios.get(`api/v1/feed/`);
      return res.data.feeds;
    },
    { refetchOnWindowFocus: false }
  );

  return { isFetching, isFetchingError, FeedPosts };
}

export function usePostFeeds() {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { mutate: createNewPost } = useMutation<
    Pick<IPost, "content" | "feed_pic_url">,
    any,
    Pick<IPost, "content" | "feed_pic_url">
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
