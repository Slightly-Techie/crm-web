"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useEndpoints from "@/services";
import { OrgChartNode } from "@/types";
import LoadingSpinner from "@/components/loadingSpinner";
import OrgChartNodeCard from "@/app/(admin)/admin/org-chart/components/OrgChartNodeCard";
import AssignManagerModal from "@/app/(admin)/admin/org-chart/components/AssignManagerModal";
import BulkAssignModal from "@/app/(admin)/admin/org-chart/components/BulkAssignModal";
import DeleteUserDialog from "@/app/(admin)/admin/org-chart/components/DeleteUserDialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/utils";
import { flattenTree, filterTree } from "@/lib/orgChartUtils";

export default function FullOrgChartPage() {
  const { getOrgChart, getUserProfile, updateUserManager } = useEndpoints();
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState<{
    type: "assign-manager" | "manage-team" | "delete" | null;
    node: OrgChartNode | null;
  }>({ type: null, node: null });

  const { data: orgChartData, isLoading, isError } = useQuery({
    queryKey: ["orgChart"],
    queryFn: () => getOrgChart().then((res) => res.data),
    refetchOnWindowFocus: false,
    enabled: sessionStatus === "authenticated",
  });

  const { data: userProfileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res?.data),
    enabled: sessionStatus === "authenticated",
    refetchOnWindowFocus: false,
  });

  const isAdmin = userProfileData?.role?.name === "admin";

  const nodeMap = useMemo(
    () => (orgChartData ? flattenTree(orgChartData) : new Map<number, OrgChartNode>()),
    [orgChartData]
  );

  const { filtered: displayData, matchIds } = useMemo(() => {
    if (!orgChartData) return { filtered: [], matchIds: new Set<number>() };
    if (search.trim().length < 2) return { filtered: orgChartData, matchIds: new Set<number>() };
    return filterTree(orgChartData, search.trim());
  }, [orgChartData, search]);

  const handleNodeClick = (node: OrgChartNode) => router.push(`/techies/${node.id}`);

  const handleContextAction = async (action: string, node: OrgChartNode) => {
    switch (action) {
      case "assign-manager":
        setModalState({ type: "assign-manager", node });
        break;
      case "manage-team":
        setModalState({ type: "manage-team", node });
        break;
      case "remove-manager":
        try {
          await updateUserManager(node.id, { manager_id: null });
          toast.success(`${node.first_name} ${node.last_name} removed from hierarchy`);
        } catch (error: any) {
          toast.error(getApiErrorMessage(error, "Failed to remove manager."));
        }
        break;
      case "delete":
        setModalState({ type: "delete", node });
        break;
    }
  };

  const closeModal = () => setModalState({ type: null, node: null });

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest">
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <section className="space-y-4">
            <div>
              <nav className="flex gap-2 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2">
                <span>Directory</span>
                <span>/</span>
                <span className="text-primary">Organization</span>
              </nav>
              <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface font-headline tracking-tighter">
                Organization Structure
              </h2>
              <p className="text-on-surface-variant mt-3 text-lg">
                Explore the organizational hierarchy and reporting relationships across the network.
              </p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 pt-4">
              <div className="flex items-center gap-3 border border-outline/40 rounded-lg px-4 py-2.5 bg-surface-container-lowest w-full md:w-96">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0">search</span>
                <input
                  type="text"
                  placeholder="Search by name, username, stack..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent focus:outline-none text-sm text-on-surface placeholder-on-surface-variant font-body w-full"
                />
              </div>
            </div>
          </section>

          {/* Chart */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-x-auto">
            {isLoading && (
              <div className="flex justify-center items-center py-32">
                <LoadingSpinner fullScreen={false} />
              </div>
            )}

            {isError && (
              <div className="bg-error-container rounded-xl p-6 text-center m-6 shadow-sm">
                <p className="text-on-error-container font-medium">Failed to load the organizational chart.</p>
              </div>
            )}

            {orgChartData && displayData.length === 0 && (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">apartment</span>
                <p className="text-on-surface-variant font-medium">
                  {search.trim().length >= 2 ? "No matching users found." : "No users in the organisation yet."}
                </p>
              </div>
            )}

            {displayData.length > 0 && (
              <div className="flex flex-col items-center gap-8 p-8 min-w-max mx-auto">
                {displayData.length > 1 ? (
                  <div className="flex flex-col items-center w-full overflow-x-auto">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">
                        Leadership ({displayData.length})
                      </span>
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div className="relative mb-6" style={{ width: `${Math.min(displayData.length, 5) * 280}px` }}>
                      <div className="absolute top-0 left-1/2 w-px h-4 bg-outline -translate-x-1/2" />
                      <div className="w-full h-px bg-outline mt-4" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 max-w-full">
                      {displayData.map((rootNode) => (
                        <div key={rootNode.id} className="flex flex-col items-center">
                          <div className="w-px h-6 bg-outline" />
                          <OrgChartNodeCard
                            node={rootNode}
                            onNodeClick={handleNodeClick}
                            onContextAction={handleContextAction}
                            highlightIds={matchIds}
                            defaultExpandDepth={search.trim().length >= 2 ? 20 : 1}
                            isAdmin={isAdmin}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  displayData.map((rootNode) => (
                    <OrgChartNodeCard
                      key={rootNode.id}
                      node={rootNode}
                      onNodeClick={handleNodeClick}
                      onContextAction={handleContextAction}
                      highlightIds={matchIds}
                      defaultExpandDepth={search.trim().length >= 2 ? 20 : 2}
                      isAdmin={isAdmin}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin-only modals */}
      {isAdmin && modalState.type === "assign-manager" && modalState.node && (
        <AssignManagerModal
          node={modalState.node}
          currentManager={
            modalState.node.manager_id ? nodeMap.get(modalState.node.manager_id) ?? null : null
          }
          onClose={closeModal}
        />
      )}
      {isAdmin && modalState.type === "manage-team" && modalState.node && (
        <BulkAssignModal manager={modalState.node} onClose={closeModal} />
      )}
      {isAdmin && modalState.type === "delete" && modalState.node && (
        <DeleteUserDialog node={modalState.node} onClose={closeModal} />
      )}
    </main>
  );
}
