"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useEndpoints from "@/services";
import Image from "next/image";
import { getTimeElapsedOrDate } from "@/utils";
import CreateFeedModal from "@/components/modals/CreateFeedModal";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function FeedPage() {
  const { getFeedsWithPagination, updateFeedPost, deleteFeedPost, getUserProfile } = useEndpoints();
  const { status: sessionStatus } = useSession();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<{ id: number; content: string } | null>(null);
  const [editContent, setEditContent] = useState("");

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((r) => r.data),
    enabled: sessionStatus === "authenticated",
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      updateFeedPost(id, { content }),
    onSuccess: () => {
      toast.success("Post updated!");
      setEditingPost(null);
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
    onError: () => toast.error("Failed to update post."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFeedPost(id),
    onSuccess: () => {
      toast.success("Post deleted.");
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
    onError: () => toast.error("Failed to delete post."),
  });

  const { data: feedsData, isLoading, isError } = useQuery({
    queryKey: ["feeds", currentPage],
    queryFn: () => getFeedsWithPagination(currentPage),
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const feeds = feedsData?.items || [];
  const paginationDetails = {
    pages: feedsData?.pages || 1,
    page: feedsData?.page || currentPage,
    total: feedsData?.total || 0,
  };

  return (
    <div className="w-full min-h-screen bg-surface-container-lowest">
      <div className="p-4 md:p-8 w-full">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-headline text-on-surface">
                Community Feed
              </h1>
              <p className="text-on-surface-variant mt-2 font-body">
                See what's happening in the network
              </p>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary text-on-primary px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold text-sm whitespace-nowrap hover:bg-primary/90 transition-all h-fit"
            >
              + Share
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[0, 1].map((index) => (
                <div
                  key={`feed-skeleton-${index + 1}`}
                  className="bg-surface-container-lowest border border-outline rounded-xl p-4 md:p-6 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-40 rounded bg-surface-container-high" />
                      <div className="h-2.5 w-24 rounded bg-surface-container-high" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-surface-container-high" />
                    <div className="h-3 w-4/5 rounded bg-surface-container-high" />
                    <div className="h-44 w-full rounded bg-surface-container-high mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="bg-error-container border border-error rounded-xl p-6 text-center">
              <p className="text-on-error-container font-medium">
                Error loading feed. Please try again.
              </p>
            </div>
          )}

          {/* Feed Posts */}
          {!isLoading && !isError && feeds.length > 0 ? (
            <div className="space-y-6">
              {feeds.map((post: any) => (
                <div
                  key={post.id}
                  className="bg-surface-container-lowest border border-outline rounded-xl p-4 md:p-6 hover:shadow-md transition-all"
                >
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-secondary-container">
                      <Image
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                        src={
                          post.user?.profile_pic_url ||
                          `https://api.dicebear.com/7.x/initials/jpg?seed=${post.user?.first_name} ${post.user?.last_name}`
                        }
                        alt={`${post.user?.first_name} ${post.user?.last_name}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm md:text-base font-semibold text-on-surface truncate">
                            {post.user?.first_name} {post.user?.last_name}
                          </h3>
                          <p className="text-xs text-on-surface-variant">
                            {getTimeElapsedOrDate(post.created_at)}
                          </p>
                        </div>
                        {userProfile && Number(post.user?.id) === Number(userProfile.id) && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingPost({ id: post.id, content: post.content });
                                setEditContent(post.content);
                              }}
                              className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Delete this post?")) deleteMutation.mutate(post.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-3">
                    {editingPost?.id === post.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-container-low text-on-surface text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingPost(null)}
                            className="px-3 py-1.5 rounded-lg border border-outline text-sm text-on-surface hover:bg-surface-container-high"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => updateMutation.mutate({ id: post.id, content: editContent })}
                            disabled={updateMutation.status === "loading" || !editContent.trim()}
                            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-sm font-semibold disabled:opacity-50"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm md:text-base text-on-surface font-body leading-relaxed">
                        {post.content}
                      </p>
                    )}

                    {/* Post Image */}
                    {post.feed_pic_url && (
                      <div className="rounded-lg overflow-hidden bg-stone-200 h-40 md:h-64 flex items-center justify-center">
                        <Image
                          className="w-full h-full object-cover"
                          width={500}
                          height={300}
                          src={post.feed_pic_url}
                          alt="Post image"
                        />
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline">
                    <p className="text-xs text-on-surface-variant">
                      {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {paginationDetails.pages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-all text-on-surface font-semibold text-sm"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from(
                      { length: Math.min(paginationDetails.pages, 5) },
                      (_, i) => {
                        let pageNum: number;
                        if (paginationDetails.pages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= paginationDetails.pages - 2) {
                          pageNum = paginationDetails.pages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`min-w-[44px] h-11 rounded-lg font-semibold text-sm transition-all ${
                              currentPage === pageNum
                                ? "bg-primary text-on-primary shadow-md"
                                : "bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high text-on-surface"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(paginationDetails.pages, prev + 1)
                      )
                    }
                    disabled={currentPage === paginationDetails.pages}
                    className="px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-all text-on-surface font-semibold text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">
                  feed
                </span>
                <h2 className="text-xl font-headline text-on-surface-variant">
                  No posts yet
                </h2>
                <p className="text-on-surface-variant mt-2">
                  Be the first to share something!
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Create Feed Modal */}
      <CreateFeedModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
