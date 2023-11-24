"use client";
import { useFetchFeeds } from "@/components/Feed/FeedServices";
import UserPost from "@/components/Feed/UserPost";
import LoadingSpinner from "@/components/loadingSpinner";
import useEndpoints from "@/services";
import { getSubdomainFromURL, getAccountUserName } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  AiOutlineLink,
  AiOutlineTwitter,
  AiOutlineGithub,
} from "react-icons/ai";

function Page() {
  //get the users ID from the route
  const { id } = useParams();

  //Initiate the getSpecific user function from the useEndpoints hook
  const { getSpecificUser } = useEndpoints();

  const { isFetching, isFetchingError, FeedPosts } = useFetchFeeds();

  const {
    data: UserProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userprofile", id],
    queryFn: () => getSpecificUser(id).then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const currentUserPosts = FeedPosts?.filter(
    (item) => item.user.id === UserProfile?.id
  );

  return (
    <section>
      {isLoading ? (
        <section>
          <LoadingSpinner />
        </section>
      ) : isError ? (
        <p>Error loading data</p>
      ) : (
        <section className="w-full h-full">
          <section className="border-b w-full p-5">
            <p className="lg:text-xl font-bold">Techies</p>
          </section>
          <section className="p-5">
            <section className="w-full flex-col lg:flex-row justify-between flex gap-2 p-5 xl:p-0">
              {/* Left Side */}
              <section className="relative lg:w-[70%] h-[500px] lg:h-[350px]">
                <section className="absolute bg-[#121212] w-full h-[150px] z-[1]"></section>
                <section className="flex flex-col gap-5 absolute z-[2] top-[125px] px-5">
                  <Image
                    className="w-12 md:w-20 h-12 md:h-20 aspect-square shrink-0 rounded-full"
                    width={48}
                    height={48}
                    src={
                      UserProfile?.profile_pic_url
                        ? UserProfile?.profile_pic_url
                        : `https://avatars.dicebear.com/api/initials/${UserProfile?.first_name} ${UserProfile?.last_name}.svg`
                    }
                    alt="profile"
                    placeholder="blur"
                    blurDataURL={`https://avatars.dicebear.com/api/initials/${UserProfile?.first_name} ${UserProfile?.last_name}.svg`}
                    priority={true}
                  />
                  <section>
                    <h1>
                      {UserProfile?.first_name} {""}
                      {UserProfile?.last_name}
                    </h1>
                    <p className="text-[#777777]">@{UserProfile.username}</p>
                    {UserProfile.bio && (
                      <section className="my-2">
                        <p>{UserProfile.bio}</p>
                      </section>
                    )}
                    <section className="flex items-center gap-2 flex-wrap">
                      <a
                        href={
                          UserProfile?.portfolio_url || "https://google.com"
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-gray-400"
                      >
                        <AiOutlineLink />
                        {getSubdomainFromURL(
                          UserProfile.portfolio_url as string
                        ) || ""}
                      </a>
                    </section>
                  </section>
                </section>
              </section>
              {/* Right Side */}
              <section className="lg:w-[25%] bg-[#121212] rounded p-5">
                <section>
                  <h1>Stack:</h1>
                  <p className="text-gray-400">
                    {UserProfile.stack?.name || "He no add yet"}
                  </p>
                </section>
                <hr className="my-5 border-[#777777]" />
                <section>
                  <h1>Socials:</h1>
                  <section>
                    <section className="flex items-center gap-2">
                      <AiOutlineTwitter />
                      <a href={(UserProfile?.twitter_profile as string) || "#"}>
                        @
                        {getAccountUserName(
                          UserProfile?.twitter_profile as string
                        )}
                      </a>
                    </section>
                    <section className="flex items-center gap-2">
                      <AiOutlineGithub />
                      <a href={(UserProfile.github_profile as string) || "#"}>
                        @
                        {getAccountUserName(
                          UserProfile.github_profile as string
                        )}
                      </a>
                    </section>
                  </section>
                </section>
              </section>
            </section>
            <section className="p-5 lg:w-[70%]">
              <section className="h-full w-full flex-col">
                {isFetching && (
                  <section className="h-full w-full flex flex-col items-center justify-center">
                    <LoadingSpinner />
                  </section>
                )}
                {isFetchingError && (
                  <h1 className="h-full w-full flex flex-col items-center justify-center">
                    There is an error fetching posts
                  </h1>
                )}
                {currentUserPosts && (
                  <>
                    <section className="  border-b border-b-neutral-600 my-6 pb-2">
                      <h2 className=" px-4 text-2xl  ">Posts</h2>
                    </section>
                    {currentUserPosts.map((data) => (
                      <UserPost key={data.id} post={data} />
                    ))}
                  </>
                )}
              </section>
            </section>
          </section>
        </section>
      )}
    </section>
  );
}

export default Page;
