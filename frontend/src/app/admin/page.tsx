"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, MapPin, CalendarDays } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    usuarios: 0,
    aulas: 0,
    cursos: 0,
    asignaciones: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, aulasRes, cursosRes, asignacionesRes] = await Promise.all([
          api.get("/users"),
          api.get("/aulas"),
          api.get("/cursos"),
          api.get("/asignaciones")
        ]);

        setCounts({
          usuarios: usersRes.data.length || 0,
          aulas: aulasRes.data.length || 0,
          cursos: cursosRes.data.length || 0,
          asignaciones: asignacionesRes.data.length || 0
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: "Total Usuarios", value: counts.usuarios.toString(), icon: Users, description: "Alumnos y profesores" },
    { title: "Aulas Activas", value: counts.aulas.toString(), icon: MapPin, description: "Sincronizadas del mapa" },
    { title: "Cursos", value: counts.cursos.toString(), icon: BookOpen, description: "Gestión 2026" },
    { title: "Asignaciones", value: counts.asignaciones.toString(), icon: CalendarDays, description: "Bloques horarios ocupados" },
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
