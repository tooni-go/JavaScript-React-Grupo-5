"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { LogOut, Hourglass, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingApprovalPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Not logged in, redirect to login
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  // If user has a role now, redirect to dashboard
  if (user.rol && user.rol !== "" && user.rol !== "PENDING") {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Hourglass className="h-10 w-10 text-amber-600 dark:text-amber-400 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Cuenta en revisión
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Tu cuenta está siendo revisada por un administrador.
            Una vez aprobada, recibirás acceso completo a la plataforma.
          </p>
          {user.email && (
            <p className="text-sm text-slate-500">
              Email: {user.email}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <span>Un administrador asignará tu rol lo antes posible.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
            <Hourglass className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <span>Si pasaron más de 24 horas, contactá a soporte.</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={logout}
          className="gap-2 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
