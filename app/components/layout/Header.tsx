"use client";

import { User } from "@/app/types";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/provider/AuthProvider";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname();
  const {logout} = useAuth();
  const navigation = [
    { name: "Home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);


  const getNavItemsClass = (href: string) => {
    let isActive = false;
    if (href === "/") {
      isActive = pathname === "/";
    } else if (href === "/dashboard") {
      isActive = pathname.startsWith(href);
    }
    return `px-3 py-2 rounded text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;
  };
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-white">
            Team Access
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getNavItemsClass(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {/* User info */}

            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <span className="text-sm text-slate-300">{user.name},({user.role})</span>
                        <button 
                        onClick={logout} 
                        className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-700 transition-colors cursor-pointer">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                    <Link
              href="/login"
              className="px-4 py-2 border border-slate-600 text-slate-300 rounded hover:bg-slate-800 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
                    </>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
