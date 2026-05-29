"use client";

import { AuthGuard } from "@/components/auth-guard";
import Link from "next/link";
import { ReactNode } from "react";
import {
  Users,
  BookOpen,
  MapPin,
  CalendarDays,
  Megaphone,
  LayoutDashboard,
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Usuarios", href: "/admin/users", icon: Users },
    { name: "Aulas", href: "/admin/aulas", icon: MapPin },
    { name: "Materias", href: "/admin/materias", icon: BookOpen },
    { name: "Horarios", href: "/admin/horarios", icon: CalendarDays },
    { name: "Charlas", href: "/admin/charlas", icon: Megaphone },
  ];

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <aside className="flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              Admin Panel
            </h2>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <Icon className="h-5 w-5 opacity-75" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
