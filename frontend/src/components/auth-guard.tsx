"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

type AuthGuardProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.rol === null || user.rol === undefined || user.rol === "") {
      router.replace("/pendiente");
      return;
    }

    if (requireAdmin && user.rol !== "SUPERADMIN") {
      router.replace("/dashboard");
    }
  }, [user, loading, requireAdmin, router]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Cargando…
      </div>
    );
  }

  if (!user) return null;

  if (user.rol === null || user.rol === undefined || user.rol === "") {
    return null;
  }

  if (requireAdmin && user.rol !== "SUPERADMIN") return null;

  return <>{children}</>;
}
