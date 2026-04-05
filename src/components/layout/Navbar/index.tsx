"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import useEndpoints from "@/services";
import { ITechie } from "@/types";
import { action } from "@/redux";
import { useAppDispatch } from "@/hooks";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

const Navlinks = [
  { id: "d1", name: "Dashboard", link: "/", icon: "dashboard" },
  { id: "c1", name: "Directory", link: "/techies", icon: "groups" },
  { id: "projects", name: "Projects", link: "/community-projects", icon: "assignment" },
  { id: "d3", name: "Feed", link: "/feed", icon: "rss_feed" },
  { id: "c3", name: "Announcements", link: "/announcements", icon: "campaign" },
  { id: "team", name: "My Team", link: "/org-chart", icon: "account_tree" },
  { id: "c5", name: "Full Org Chart", link: "/full-org-chart", icon: "corporate_fare" },
  { id: "d2", name: "Applicants", link: "/admin/applicants", icon: "hourglass_empty", adminOnly: true },
  { id: "admin-settings", name: "Admin Settings", link: "/admin/settings", icon: "tune", adminOnly: true },
];

function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={`w-9 h-9 ${className}`} />;
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-surface-container text-on-surface-variant ${className}`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

function Navbar() {
  const { getUserProfile } = useEndpoints();
  const session = useSession();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [navToggle, setNavToggle] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    onSuccess(data) {
      dispatch(action.auth.setUser(data));
    },
    enabled: session.status === "authenticated",
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const handleSignOut = async () => {
    queryClient.clear();
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const role = query.data?.role?.name;
  const currentUser = query.data;

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        profileMenuRef.current?.contains(target) ||
        mobileProfileMenuRef.current?.contains(target)
      ) {
        return;
      }
      setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  const isActiveLink = (link: string) => {
    if (link === "/") return pathname === "/";
    return pathname.startsWith(link);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-surface-container-low border-r border-outline/20 z-50 overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5">
          <h1 className="text-lg font-black text-primary font-headline">ST Network</h1>
          <ThemeToggle />
        </div>

        <nav className="flex flex-col gap-y-1 p-4 flex-1 font-body text-sm font-medium">
          {Navlinks.map((item) => {
            if (item.adminOnly && role !== "admin") return null;
            const isActive = isActiveLink(item.link);
            return (
              <Link href={item.link} key={item.id}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-outline/20">
          {session.status === "authenticated" && query.isLoading && (
            <div className="animate-pulse rounded-xl border border-outline/20 bg-surface-container p-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-surface-container-high" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-surface-container-high" />
                  <div className="h-2.5 w-16 rounded bg-surface-container-high" />
                </div>
              </div>
            </div>
          )}

          {session.status === "authenticated" && !query.isLoading && (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-outline/20 bg-surface-container hover:bg-surface-container-high transition-all"
              >
                <Image
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  width={36}
                  height={36}
                  src={
                    currentUser?.profile_pic_url ||
                    `https://api.dicebear.com/7.x/initials/jpg?seed=${currentUser?.first_name ?? "User"} ${currentUser?.last_name ?? ""}`
                  }
                  alt={currentUser?.username || "User profile"}
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-xs text-on-surface truncate">
                    {currentUser && `${currentUser.first_name} ${currentUser.last_name}`}
                  </p>
                  {currentUser?.stack?.name && (
                    <p className="text-[10px] text-on-surface-variant truncate">{currentUser.stack.name}</p>
                  )}
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-base">
                  {isProfileMenuOpen ? "expand_more" : "expand_less"}
                </span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-full rounded-xl border border-outline/20 bg-surface-container-lowest shadow-lg py-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-base">settings</span>
                    <span>Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleSignOut()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="block lg:hidden fixed top-0 left-0 right-0 z-[9999] bg-surface-container-low border-b border-outline/20 h-16">
        <div className="flex justify-between items-center px-4 h-full">
          <h1 className="text-lg font-black text-primary font-headline">ST Network</h1>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-surface-container transition-colors"
              onClick={() => setNavToggle(!navToggle)}
            >
              <AiOutlineMenu size={24} className="text-on-surface" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed z-[9998] top-0 left-0 w-64 h-screen bg-surface-container-low border-r border-outline/20 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
        navToggle ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center px-4 h-16 border-b border-outline/20">
            <h1 className="text-lg font-black text-primary font-headline">ST Network</h1>
            <button
              className="p-2 rounded-lg hover:bg-surface-container transition-colors"
              onClick={() => setNavToggle(false)}
            >
              <AiOutlineClose size={20} className="text-on-surface" />
            </button>
          </div>

          <nav className="flex flex-col gap-y-1 font-body text-sm font-medium p-4">
            {Navlinks.map((item) => {
              if (item.adminOnly && role !== "admin") return null;
              const isActive = isActiveLink(item.link);
              return (
                <Link href={item.link} key={item.id} onClick={() => setNavToggle(false)}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          {session.status === "authenticated" && query.isLoading && (
            <div className="mt-auto border-t border-outline/20 px-4 pb-4 pt-2">
              <div className="animate-pulse rounded-xl border border-outline/20 bg-surface-container p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface-container-high flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-surface-container-high" />
                    <div className="h-2.5 w-16 rounded bg-surface-container-high" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {session.status === "authenticated" && !query.isLoading && (
            <div className="mt-auto border-t border-outline/20 px-4 pb-4 pt-2" ref={mobileProfileMenuRef}>
              {isProfileMenuOpen && (
                <div className="rounded-xl border border-outline/20 bg-surface-container-lowest overflow-hidden mb-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => { setNavToggle(false); setIsProfileMenuOpen(false); router.push("/settings"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-base">settings</span>
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-outline/20" />
                  <button
                    type="button"
                    onClick={() => { setNavToggle(false); setIsProfileMenuOpen(false); handleSignOut(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error/10"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span className="font-medium">Log Out</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-outline/20 bg-surface-container hover:bg-surface-container-high transition-all"
              >
                <Image
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  width={40}
                  height={40}
                  src={
                    currentUser?.profile_pic_url ||
                    `https://api.dicebear.com/7.x/initials/jpg?seed=${currentUser?.first_name ?? "User"} ${currentUser?.last_name ?? ""}`
                  }
                  alt={currentUser?.username || "User profile"}
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-sm text-on-surface truncate">
                    {currentUser && `${currentUser.first_name} ${currentUser.last_name}`}
                  </p>
                  {currentUser?.stack?.name && (
                    <p className="text-xs text-on-surface-variant truncate">{currentUser.stack.name}</p>
                  )}
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-base">
                  {isProfileMenuOpen ? "expand_more" : "expand_less"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {navToggle && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-[9990] lg:hidden"
          onClick={() => setNavToggle(false)}
          aria-label="Close navigation menu"
        />
      )}

      <style jsx global>{`
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </>
  );
}

export default Navbar;
