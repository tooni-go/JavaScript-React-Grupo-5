import { ReactNode } from "react";
import Link from "next/link";
import { Users, BookOpen, MapPin, CalendarDays, Megaphone, LayoutDashboard } from "lucide-react";

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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
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
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
