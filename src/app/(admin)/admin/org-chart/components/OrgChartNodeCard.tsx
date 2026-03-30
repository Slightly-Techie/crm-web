"use client";

import { OrgChartNode } from "@/types";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

interface OrgChartNodeCardProps {
  node: OrgChartNode;
  depth?: number;
  defaultExpandDepth?: number;
  onNodeClick?: (node: OrgChartNode) => void;
  onContextAction?: (action: string, node: OrgChartNode) => void;
  highlightIds?: Set<number>;
}

export default function OrgChartNodeCard({
  node,
  depth = 0,
  defaultExpandDepth = 2,
  onNodeClick,
  onContextAction,
  highlightIds,
}: OrgChartNodeCardProps) {
  const [expanded, setExpanded] = useState(depth < defaultExpandDepth);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasChildren = node.subordinates.length > 0;
  const isHighlighted = highlightIds?.has(node.id) ?? false;

  const profilePicUrl =
    node.profile_pic_url && node.profile_pic_url !== "string"
      ? node.profile_pic_url
      : `https://api.dicebear.com/7.x/initials/jpg?seed=${node.first_name} ${node.last_name}`;

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="flex flex-col items-center">
      {/* Node Card — fixed width */}
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border-2 shadow-sm hover:shadow-md transition-all cursor-pointer w-[260px] h-[80px] ${
          isHighlighted
            ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-500 ring-2 ring-yellow-300 dark:ring-yellow-600"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] hover:border-blue-400 dark:hover:border-blue-500"
        }`}
        onClick={() => onNodeClick?.(node)}
      >
        <Image
          className="w-10 h-10 rounded-full object-cover shrink-0"
          width={40}
          height={40}
          src={profilePicUrl}
          alt={`${node.first_name} ${node.last_name}`}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {node.first_name} {node.last_name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            @{node.username}
          </p>
          <div className="flex gap-1 mt-1 flex-wrap">
            {node.role && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  node.role.name === "admin"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {node.role.name}
              </span>
            )}
            {node.stack && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium truncate max-w-[80px]">
                {node.stack.name}
              </span>
            )}
          </div>
        </div>

        {/* Actions column */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          {/* 3-dot menu button */}
          <div ref={menuRef} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <BsThreeDotsVertical size={14} />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg py-1 min-w-[160px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onContextAction?.("assign-manager", node);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Assign Manager
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onContextAction?.("manage-team", node);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Manage Team
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onContextAction?.("remove-manager", node);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Remove from Hierarchy
                </button>
                <hr className="my-1 dark:border-gray-700" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onContextAction?.("delete", node);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                >
                  Delete User
                </button>
              </div>
            )}
          </div>

          {/* Expand/collapse toggle */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {expanded ? (
                <AiOutlineDown size={12} />
              ) : (
                <AiOutlineRight size={12} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Connector line + children */}
      {hasChildren && expanded && (
        <div className="flex flex-col items-center mt-0">
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

          {node.subordinates.length > 1 && (
            <div
              className="h-px bg-gray-300 dark:bg-gray-600"
              style={{
                width: `${Math.max((node.subordinates.length - 1) * 280, 100)}px`,
              }}
            />
          )}

          <div className="flex gap-5">
            {node.subordinates.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                <OrgChartNodeCard
                  node={child}
                  depth={depth + 1}
                  defaultExpandDepth={defaultExpandDepth}
                  onNodeClick={onNodeClick}
                  onContextAction={onContextAction}
                  highlightIds={highlightIds}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed indicator */}
      {hasChildren && !expanded && (
        <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {node.subordinates.length} report{node.subordinates.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
