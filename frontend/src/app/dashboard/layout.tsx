"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  Map,
  Megaphone,
  Settings,
  ArrowLeft,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const isAdmin = user?.rol === "SUPERADMIN";
  const isStudent = user?.rol === "ESTUDIANTE";
  const isProfesor = user?.rol === "PROFESOR";

  const navItems = [
    { name: "Mapa Interactivo", href: "/dashboard", icon: Map, exact: true },
  ];

  if (isStudent || isProfesor) {
    navItems.push({ name: "Charlas", href: "/dashboard/charlas", icon: Megaphone, exact: false });
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <aside className="hidden md:flex w-56 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              Mi Panel
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{user?.email}</p>
          </div>
          <nav className="flex-1 py-3">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        active
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-4 w-4 opacity-75" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {isAdmin && (
              <div className="mt-4 px-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/20 cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  Panel Admin
                </Link>
              </div>
            )}
            <div className="mt-4 px-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/auth/login"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 opacity-75" />
                Cerrar sesión
              </Link>
            </div>
          </nav>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
