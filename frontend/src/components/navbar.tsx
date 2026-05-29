"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { getApiBase } from "@/lib/api";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    if (user?.accessToken) {
      try {
        await axios.post(
          `${getApiBase()}/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${user.accessToken}` } },
        );
      } catch {
        // Cerramos sesión local aunque falle el backend
      }
    }
    logout();
    router.push("/auth/login");
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          Mapa Interactivo
        </Link>

        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <span className="hidden text-sm text-slate-600 md:inline">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button size="sm">Iniciar Sesión</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
