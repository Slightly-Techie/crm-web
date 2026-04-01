"use client";

import { OrgChartNode } from "@/types";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { createPortal } from "react-dom";

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
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasChildren = node.subordinates.length > 0;
  const isHighlighted = highlightIds?.has(node.id) ?? false;

  const profilePicUrl =
    node.profile_pic_url && node.profile_pic_url !== "string"
      ? node.profile_pic_url
      : `https://api.dicebear.com/7.x/initials/jpg?seed=${node.first_name} ${node.last_name}`;

  const showMenu = menuPosition !== null;

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickedTrigger = target.closest("[data-org-menu-trigger='true']");
      if (clickedTrigger || menuRef.current?.contains(target)) {
        return;
      }
      setMenuPosition(null);
    };

    const closeMenu = () => setMenuPosition(null);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [showMenu]);

  const handleMenuToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (showMenu) {
      setMenuPosition(null);
      return;
    }

    const triggerRect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 180;
    const estimatedMenuHeight = 210;
    const gap = 8;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const openUp = spaceBelow < estimatedMenuHeight && spaceAbove > estimatedMenuHeight;

    const top = openUp
      ? Math.max(gap, triggerRect.top - estimatedMenuHeight - gap)
      : Math.min(window.innerHeight - estimatedMenuHeight - gap, triggerRect.bottom + gap);

    const left = Math.max(
      gap,
      Math.min(window.innerWidth - menuWidth - gap, triggerRect.right - menuWidth)
    );

    setMenuPosition({ top, left });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-sm hover:shadow-md transition-all cursor-pointer w-[260px] ${
          isHighlighted
            ? "border-yellow-400 bg-yellow-50 ring-2 ring-yellow-300"
            : depth === 0
            ? "border-primary bg-primary/5 shadow-md"
            : "border-outline bg-surface-container-lowest hover:border-primary/50"
        }`}
        onClick={() => onNodeClick?.(node)}
      >
        <Image
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-secondary-container"
          width={40}
          height={40}
          src={profilePicUrl}
          alt={`${node.first_name} ${node.last_name}`}
        />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${depth === 0 ? "text-primary" : "text-on-surface"}`}>
            {node.first_name} {node.last_name}
          </p>
          <p className="text-xs text-on-surface-variant truncate">@{node.username}</p>
          <div className="flex gap-1 mt-1 flex-wrap">
            {node.role && (
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  node.role.name === "admin"
                    ? "bg-primary/15 text-primary"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {node.role.name}
              </span>
            )}
            {node.stack && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-medium truncate max-w-[80px]">
                {node.stack.name}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div ref={menuRef} className="relative">
            <button
              onClick={handleMenuToggle}
              data-org-menu-trigger="true"
              className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <BsThreeDotsVertical size={14} />
            </button>
          </div>

          {hasChildren && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
              title={expanded ? "Collapse" : "Expand"}
            >
              <span className="material-symbols-outlined text-sm">
                {expanded ? "expand_less" : "expand_more"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Connector + children */}
      {hasChildren && expanded && (
        <div className="flex flex-col items-center mt-0">
          <div className="w-px h-6 bg-outline" />

          {node.subordinates.length > 1 && (
            <div
              className="h-px bg-outline"
              style={{ width: `${Math.max((node.subordinates.length - 1) * 280, 100)}px` }}
            />
          )}

          <div className="flex gap-5">
            {node.subordinates.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-outline" />
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

      {hasChildren && !expanded && (
        <div className="mt-1 text-xs text-on-surface-variant font-medium">
          {node.subordinates.length} report{node.subordinates.length !== 1 ? "s" : ""}
        </div>
      )}

      {showMenu && menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[1000] bg-surface-container-lowest border border-outline rounded-xl shadow-lg py-1 min-w-[170px]"
            style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuPosition(null);
                onContextAction?.("assign-manager", node);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-high text-on-surface flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-on-surface-variant">manage_accounts</span>
              Assign Manager
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuPosition(null);
                onContextAction?.("manage-team", node);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-high text-on-surface flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-on-surface-variant">group_add</span>
              Manage Team
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuPosition(null);
                onContextAction?.("remove-manager", node);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-high text-on-surface flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-on-surface-variant">link_off</span>
              Remove from Hierarchy
            </button>
            <div className="my-1 border-t border-outline" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuPosition(null);
                onContextAction?.("delete", node);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-error/5 text-error flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-base">delete</span>
              Delete User
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
