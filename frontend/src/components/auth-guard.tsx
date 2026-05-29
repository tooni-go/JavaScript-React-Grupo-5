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

  if (!user || (requireAdmin && user.rol !== "SUPERADMIN")) {
    return null;
  }

  return <>{children}</>;
}
