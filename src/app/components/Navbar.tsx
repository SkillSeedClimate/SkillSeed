import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Leaf, Menu, X, ChevronDown } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E6F4EE] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#0F3D2E] rounded-lg flex items-center justify-center group-hover:bg-[#2F8F6B] transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#0F3D2E] font-[Manrope] font-bold text-xl tracking-tight">
              Skill<span className="text-[#2F8F6B]">Seed</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-[#E6F4EE] text-[#0F3D2E]"
                  : "text-gray-600 hover:text-[#0F3D2E] hover:bg-[#E6F4EE]"
              }`}
            >
              Match
            </Link>
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 flex items-center gap-1 cursor-default">
                Academy
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold ml-1">
                  Soon
                </span>
              </button>
            </div>
            <div className="relative group">
              <Link
                to="/progress"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  isActive("/progress")
                    ? "bg-[#E6F4EE] text-[#0F3D2E]"
                    : "text-gray-600 hover:text-[#0F3D2E] hover:bg-[#E6F4EE]"
                }`}
              >
                Tracker
              </Link>
            </div>
            <Link
              to="/funding"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/funding")
                  ? "bg-[#E6F4EE] text-[#0F3D2E]"
                  : "text-gray-600 hover:text-[#0F3D2E] hover:bg-[#E6F4EE]"
              }`}
            >
              Funding
            </Link>
            <Link
              to="/community"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/community")
                  ? "bg-[#E6F4EE] text-[#0F3D2E]"
                  : "text-gray-600 hover:text-[#0F3D2E] hover:bg-[#E6F4EE]"
              }`}
            >
              Community
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/auth"
              className="text-sm font-medium text-gray-600 hover:text-[#0F3D2E] transition-colors px-3 py-2"
            >
              Log In
            </Link>
            <Link
              to="/auth"
              className="text-sm font-medium bg-[#0F3D2E] text-white px-4 py-2 rounded-lg hover:bg-[#2F8F6B] transition-colors"
            >
              Sign Up
            </Link>
            <Link
              to="/post-project"
              className="text-sm font-medium bg-[#2F8F6B] text-white px-4 py-2 rounded-lg hover:bg-[#0F3D2E] transition-colors"
            >
              Post a Project
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-[#E6F4EE]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#E6F4EE] py-3 space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#E6F4EE] hover:text-[#0F3D2E] rounded-lg"
            >
              Match
            </Link>
            <div className="px-4 py-2.5 text-sm font-medium text-gray-400 flex items-center gap-2">
              Academy
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                Soon
              </span>
            </div>
            <Link
              to="/progress"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#E6F4EE] hover:text-[#0F3D2E] rounded-lg"
            >
              Tracker
            </Link>
            <Link
              to="/funding"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#E6F4EE] hover:text-[#0F3D2E] rounded-lg"
            >
              Funding
            </Link>
            <Link
              to="/community"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#E6F4EE] hover:text-[#0F3D2E] rounded-lg"
            >
              Community
            </Link>
            <div className="pt-2 border-t border-[#E6F4EE] flex gap-2 px-4">
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-medium bg-[#0F3D2E] text-white px-3 py-2 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
