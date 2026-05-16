import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, MapPin, CalendarDays } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Usuarios", value: "150", icon: Users, description: "Alumnos y profesores" },
    { title: "Aulas Activas", value: "12", icon: MapPin, description: "Sincronizadas del mapa" },
    { title: "Cursos", value: "24", icon: BookOpen, description: "Gestión 2026" },
    { title: "Asignaciones", value: "85", icon: CalendarDays, description: "Bloques horarios ocupados" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Panel de Control</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Bienvenido al centro de administración de la Escuela Interactiva.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
