"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import { OrgChartNode } from "@/types";
import PageTitle from "@/components/PageTitle";
import LoadingSpinner from "@/components/loadingSpinner";
import OrgChartNodeCard from "./components/OrgChartNodeCard";
import AssignManagerModal from "./components/AssignManagerModal";
import BulkAssignModal from "./components/BulkAssignModal";
import DeleteUserDialog from "./components/DeleteUserDialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";

// Recursively filter the tree, keeping nodes that match + their ancestors
function filterTree(
  nodes: OrgChartNode[],
  query: string
): { filtered: OrgChartNode[]; matchIds: Set<number> } {
  const matchIds = new Set<number>();
  const q = query.toLowerCase();

  function nodeMatches(node: OrgChartNode): boolean {
    const fullName = `${node.first_name} ${node.last_name}`.toLowerCase();
    return (
      fullName.includes(q) ||
      node.username.toLowerCase().includes(q) ||
      (node.stack?.name.toLowerCase().includes(q) ?? false) ||
      (node.role?.name.toLowerCase().includes(q) ?? false)
    );
  }

  function prune(node: OrgChartNode): OrgChartNode | null {
    const selfMatch = nodeMatches(node);
    if (selfMatch) matchIds.add(node.id);

    // If this node matches, keep its entire subtree intact
    if (selfMatch) {
      return node;
    }

    // Otherwise, only keep this node if a descendant matches
    const childResults = node.subordinates
      .map(prune)
      .filter(Boolean) as OrgChartNode[];

    if (childResults.length > 0) {
      return { ...node, subordinates: childResults };
    }
    return null;
  }

  const filtered = nodes.map(prune).filter(Boolean) as OrgChartNode[];
  return { filtered, matchIds };
}

export default function OrgChartPage() {
  const { getOrgChart, updateUserManager } = useEndpoints();
  const router = useRouter();
  const [maxDepth, setMaxDepth] = useState(5);
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState<{
    type: "assign-manager" | "manage-team" | "delete" | null;
    node: OrgChartNode | null;
  }>({ type: null, node: null });

  const {
    data: orgChartData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orgChart", maxDepth],
    queryFn: () => getOrgChart(maxDepth).then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const { filtered: displayData, matchIds } = useMemo(() => {
    if (!orgChartData || search.trim().length < 2)
      return { filtered: orgChartData ?? [], matchIds: new Set<number>() };
    return filterTree(orgChartData, search.trim());
  }, [orgChartData, search]);

  const handleNodeClick = (node: OrgChartNode) => {
    router.push(`/techies/${node.id}`);
  };

  const handleContextAction = async (
    action: string,
    node: OrgChartNode
  ) => {
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
          toast.success(
            `${node.first_name} ${node.last_name} removed from hierarchy`
          );
          // Re-fetch handled by React Query invalidation isn't automatic here,
          // but the queryClient is available in the modal components
        } catch (error: any) {
          toast.error(
            error?.response?.data?.detail || "Failed to remove manager."
          );
        }
        break;
      case "delete":
        setModalState({ type: "delete", node });
        break;
    }
  };

  const closeModal = () => setModalState({ type: null, node: null });

  return (
    <main>
      <PageTitle title="Organizational Chart" />
      <section className="pt-[7vh]">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Organization Structure
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 border dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-900">
              <AiOutlineSearch size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by name, username, stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 w-[220px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Depth:
              </label>
              <select
                value={maxDepth}
                onChange={(e) => setMaxDepth(Number(e.target.value))}
                className="border dark:border-gray-700 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} level{n !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-5 overflow-x-auto">
          {isLoading && <LoadingSpinner />}

          {isError && (
            <div className="text-center py-16">
              <p className="text-red-500">
                Failed to load the organizational chart.
              </p>
            </div>
          )}

          {orgChartData && displayData.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {search.trim().length >= 2
                  ? "No matching users found."
                  : "No users in the organisation yet."}
              </p>
            </div>
          )}

          {displayData.length > 0 && (
            <div className="flex flex-col items-center gap-8">
              {displayData.map((rootNode) => (
                <OrgChartNodeCard
                  key={rootNode.id}
                  node={rootNode}
                  onNodeClick={handleNodeClick}
                  onContextAction={handleContextAction}
                  highlightIds={matchIds}
                  defaultExpandDepth={search.trim().length >= 2 ? 20 : 2}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {modalState.type === "assign-manager" && modalState.node && (
        <AssignManagerModal node={modalState.node} onClose={closeModal} />
      )}
      {modalState.type === "manage-team" && modalState.node && (
        <BulkAssignModal manager={modalState.node} onClose={closeModal} />
      )}
      {modalState.type === "delete" && modalState.node && (
        <DeleteUserDialog node={modalState.node} onClose={closeModal} />
      )}
    </main>
  );
}
