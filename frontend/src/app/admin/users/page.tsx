import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestión de Usuarios</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Administra los perfiles, roles y permisos de los usuarios del sistema.
        </p>
      </div>

      <Card className="border-dashed border-2 shadow-none bg-slate-50/50 dark:bg-slate-900/50">
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-center">
          <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800 mb-4">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Módulo en construcción</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-2">
            Aquí se mostrará el panel de administración correspondiente a los Usuarios.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
