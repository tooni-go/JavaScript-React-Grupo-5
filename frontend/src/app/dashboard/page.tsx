"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <main className="h-[calc(100vh-4rem)] bg-slate-50 w-full relative overflow-hidden flex items-center justify-center">
        {/* Placeholder futuro para el mapa SVG interactivo */}
        <p className="text-muted-foreground opacity-50 font-medium">Espacio reservado para el mapa interactivo</p>
        
        {user?.rol === "SUPERADMIN" && (
          <div className="absolute bottom-6 right-6 z-50">
            <Link href="/admin">
              <Button variant="secondary" className="shadow-lg font-medium">
                Panel de Administración
              </Button>
            </Link>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
