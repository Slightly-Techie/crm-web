"use client";
import { useFetchFeeds } from "@/components/Feed/FeedServices";
import UserPost from "@/components/Feed/UserPost";
import LoadingSpinner from "@/components/loadingSpinner";
import useEndpoints from "@/services";
import { getAccountUserName } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import PageTitle from "@/components/PageTitle";
import { useParams } from "next/navigation";
import {
  AiOutlineLink,
  AiOutlineTwitter,
  AiOutlineGithub,
  AiOutlineLinkedin,
} from "react-icons/ai";
import Link from "next/link";
import { useState } from "react";

function Page() {
  // Get the user's ID from the route
  const { id } = useParams();
  // console.log('id', typeof +id)

  // Initiate the getSpecific user function from the useEndpoints hook
  const { getSpecificUser, applicantTask, taskSubmissions } = useEndpoints();

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


  // const {
  //   data: ApplicantSubmission,
  // } = useQuery({
  //   queryKey: ["tasksubmission", id],
  //   queryFn: () => taskSubmissions(id).then((res) => res.data),
  //   refetchOnWindowFocus: false,
  // });


  // console.log('Applicant>>', ApplicantSubmission)
  // console.log('first', ApplicantSubmission.task_id)
  // console.log('UserProfile', UserProfile)
  console.log('UserProfile', UserProfile)
  // const TaskId =  Number(ApplicantSubmission?.task_id)
  // console.log('TaskId', TaskId)

  const currentUserPosts = FeedPosts?.filter(
    (item) => item.user.id === UserProfile?.id
  );

  //   const {
  //   data: ApplicantTask,
  // } = useQuery({
  //   queryKey: ["applicanttask", TaskId],
  //   queryFn: () => applicantTask(TaskId).then((res) => res.data),
  //   refetchOnWindowFocus: false,
  // });

  // console.log('Applicant Task', ApplicantTask)

  // State to handle fallback for profile image
  const [profilePicUrl, setProfilePicUrl] = useState(
    UserProfile?.profile_pic_url && UserProfile?.profile_pic_url !== "string"
      ? UserProfile.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${UserProfile?.first_name} ${UserProfile?.last_name}`
      : `https://api.dicebear.com/7.x/initials/jpg?seed=${UserProfile?.first_name} ${UserProfile?.last_name}`
  );

  const handleImageError = () => {
    // Set fallback image if the provided URL fails
    setProfilePicUrl(`https://avatars.dicebear.com/api/initials/${UserProfile?.first_name} ${UserProfile?.last_name}.svg`);
  };

  const formattedStatus = UserProfile?.status
    ? UserProfile.status.charAt(0).toUpperCase() +
      UserProfile.status.slice(1).toLowerCase()
    : "Unspecified";

  const techTask = UserProfile?.technical_task
  console.log('techTask', techTask)
    

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
          <PageTitle
            title={`${UserProfile.first_name} ${UserProfile.last_name}`}
          />
          <section className="px-5 pt-[10vh]">
            <section className="w-full flex-col lg:flex-row justify-between flex gap-2 p-5 xl:p-0">
              {/* Left Side */}
              <section className="relative lg:w-[70%] h-[500px] lg:h-[350px]">
                <section className="absolute bg-primary-light dark:bg-st-surfaceDark w-full h-[150px] z-[1]"></section>
                <section className="flex flex-col gap-5 absolute z-[2] top-[125px] px-5">
                <Image
                    className="w-12 md:w-20 h-12 md:h-20 aspect-square shrink-0 rounded-full object-cover"
                    width={1000}
                    height={1000}
                    src={profilePicUrl}
                    alt="profile"
                    placeholder="blur"
                    blurDataURL={`https://avatars.dicebear.com/api/initials/${UserProfile?.first_name} ${UserProfile?.last_name}.svg`}
                    priority={true}
                    onError={handleImageError} // Sets fallback on error
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
                        href={UserProfile?.portfolio_url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm flex items-center gap-2 text-gray-400"
                      >
                        <AiOutlineLink />
                        {(UserProfile.portfolio_url as string) || "Unspecified"}
                      </a>
                    </section>
                    <p>Tel: {UserProfile.phone_number} </p>
                  </section>
                </section>
              </section>
              {/* Right Side */}
              <section className="lg:w-[25%] bg-primary-light dark:bg-[#121212] rounded p-5">
                <section>
                  <div className="flex items-center gap-2">
                    <p>Status:</p>
                    <span> {formattedStatus} </span>
                  </div>
                  <h1>Stack:</h1>
                  <p className="text-gray-400">
                    {UserProfile.stack?.name || "Unspecified"}
                  </p>
                  <div className="flex items-center gap-2">
                    <p>
                      Years of Experience: {UserProfile.years_of_experience}
                    </p>
                  </div>
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
                        ) || "Unspecified"}
                      </a>
                    </section>
                    <section className="flex items-center gap-2">
                      <AiOutlineGithub />
                      <a href={(UserProfile.github_profile as string) || "#"}>
                        @
                        {getAccountUserName(
                          UserProfile.github_profile as string
                        ) || "Unspecified"}
                      </a>
                    </section>
                    <section className="flex items-center gap-2">
                      <AiOutlineLinkedin />
                      <a href={(UserProfile.linkedin_profile as string) || "#"}>
                        @
                        {getAccountUserName(
                          UserProfile.linkedin_profile as string
                        ) || "Unspecified"}
                      </a>
                    </section>
                    <section>
                      {UserProfile.skills.map((item:any) => {
                        return (
                          <p className=" text-st-surface" key={item}>
                            {item}
                          </p>
                        );
                      })}
                    </section>

                  </section>
                </section>
              </section>
            </section>
            <section className=" mt-[100px]">
              <h1 className="flex items-center justify-center font-bold text-2xl">Task</h1>
              <section className="mt-5">
                {techTask ? (
                  <>
                    <h2 className="font-semibold mb-5">Description</h2>
                    <p className="text-gray-700">{techTask.description || "No Description available"}</p>
                    <div className="flex gap-20 items-center mt-10">
                      <div>
                        <h2 className="font-semibold mb-5">Github Link</h2>
                        <p className="text-gray-700">{techTask.github_link || "No link available"}</p>
                      </div>
                      <div>
                        <h2 className="font-semibold mb-5">Demo Link</h2>
                        <p className="text-gray-700">{techTask.live_demo_url || "No demo available"}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  // Placeholder when techTask is null or undefined
                  <p className="text-gray-500">No technical task available for this user.</p>
                )}
              </section>
            </section>

            <section className="p-5 lg:w-[70%]">
              <section className="h-full w-full flex-col bg-red-400">
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
                {currentUserPosts?.length! > 1 && (
                  <>
                    <section className="  border-b border-b-neutral-600 my-6 pb-2">
                      <h2 className="text-xl">
                        Posts ({currentUserPosts?.length})
                      </h2>
                    </section>
                    {currentUserPosts?.map((data) => (
                      <UserPost key={data.id} post={data} />
                    ))}
                  </>
                )}
              </section>
            </section>
          </section>
          {!currentUserPosts?.length && (
            <section className="h-full py-28 w-full flex flex-col items-center justify-center">
              <h1>No posts found</h1>
              <p className="mt-4">
                Say Hello to the{" "}
                <Link href="/" className="font-bold">
                  {" "}
                  Slightly Techie Community.{" "}
                </Link>
              </p>
            </section>
          )}
        </section>
      )}
    </section>
  );
}

export default Page;
