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
  LogOut,
  MapPin,
  User,
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
          <div className="border-b border-slate-200 p-4 dark:border-slate-800 flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Mapa IPS
            </h2>
          </div>
          <nav className="flex-1 py-3 flex flex-col">
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
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
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
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Settings className="h-4 w-4 opacity-75" />
                  Panel Admin
                </Link>
              </div>
            )}
            
            <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-4 pb-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full shrink-0">
                  <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Usuario</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <Link
                href="/auth/login"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 opacity-75" />
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
