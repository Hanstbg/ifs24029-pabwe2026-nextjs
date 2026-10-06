"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconArticle,
  IconUser,
  IconLogout,
  IconChevronDown,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { getImageUrl } from "@/lib/config";

function NavbarComponent({ profile, handleLogout, onToggleSidebar, isSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null as HTMLDivElement | null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="toggle-sidebar-btn"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? (
              <IconX aria-hidden="true" size={20} />
            ) : (
              <IconMenu2 aria-hidden="true" size={20} />
            )}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <IconArticle aria-hidden="true" size={22} stroke={2.5} />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900">Delcom Post</span>
            </div>
          </Link>
        </div>

        {/* Profile User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            data-testid="profile-dropdown-button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Menu akun"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {profile?.photo ? (
              <img
                src={getImageUrl(profile.photo)}
                alt=""
                width={32}
                height={32}
                decoding="async"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-800 leading-tight">
                {profile?.name || "Pengguna"}
              </span>
              <span className="text-xs text-slate-600 leading-tight">
                {profile?.email || ""}
              </span>
            </div>
            <IconChevronDown
              aria-hidden="true"
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div
              data-testid="profile-dropdown-menu"
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-900/5 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3 py-2 sm:hidden">
                <p className="text-sm font-semibold text-slate-800">{profile?.name}</p>
                <p className="text-xs text-slate-600 truncate">{profile?.email}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  data-testid="dropdown-profile-link"
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <IconUser aria-hidden="true" size={18} className="text-slate-500" />
                  Profil Saya
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  data-testid="dropdown-logout-button"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-700 rounded-xl hover:bg-red-50 transition-colors text-left"
                >
                  <IconLogout aria-hidden="true" size={18} className="text-red-500" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavbarComponent;