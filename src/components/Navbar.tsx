import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Jobs", path: "/jobs" },
    { name: "For Schools", path: "/schools" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <img src="/logo.svg" alt="BeleX" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.path ? "text-primary" : "text-slate-600"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="Avatar" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary">
                      <UserIcon size={16} />
                    </div>
                  )}
                  <span>Dashboard</span>
                </Link>
                {profile?.role === "teacher" && (
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary">
                    <UserIcon size={16} />
                    <span>Profile</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Log out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary">
                  Log in
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-white p-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary" : "text-slate-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-slate-100" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-base font-medium text-slate-600">
                  <UserIcon size={20} />
                  Dashboard
                </Link>
                {profile?.role === "teacher" && (
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-base font-medium text-slate-600">
                    <UserIcon size={20} />
                    Profile
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-base font-medium text-red-500"
                >
                  <LogOut size={20} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-base font-medium text-slate-600">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
