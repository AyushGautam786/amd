"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
  Activity
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/foods", label: "Food Inventory", icon: Utensils },
  { href: "/exercises", label: "Workouts", icon: Dumbbell },
  { href: "/habits", label: "Habits", icon: Activity },
  { href: "/chat", label: "AI Coach", icon: MessageCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/profile");
          const data = await res.json();
          if (!data.data?.onboardingComplete && pathname !== "/onboarding") {
            router.push("/onboarding");
          } else {
            setIsChecking(false);
          }
        } catch (error) {
          console.error("Error checking profile:", error);
          setIsChecking(false);
        }
      }
    }
    checkProfile();
  }, [status, pathname, router]);

  if (status === "loading" || isChecking) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If we're on the onboarding page, don't show the sidebar
  if (pathname === "/onboarding") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-gray-950/50 backdrop-blur-xl">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">NutriHabit</span>
          </Link>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 font-medium"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : ""}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/50 rounded-xl mb-4">
            <Avatar className="w-9 h-9 border border-gray-700">
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback>{session?.user?.name?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl z-50 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-gray-950 border-l border-gray-800 z-50 flex flex-col md:hidden"
            >
              <div className="p-4 flex justify-end border-b border-gray-800">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-400 font-medium"
                            : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : ""}`} />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto pt-16 md:pt-0 pb-10">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
