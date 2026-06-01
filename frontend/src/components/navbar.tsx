"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getApiBase } from "@/lib/api";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import ipsLogo from "../../public/ips-logo.png";

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

  // Obtener iniciales del email para el avatar
  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : "US";
  };

  return (
    <nav className="h-16 w-full bg-primary text-primary-foreground shadow-md flex items-center">
      {/* 1. Bloque Izquierdo (Logo) */}
      <div className="flex h-full w-16 shrink-0 items-center justify-center border-r border-red-800/50 md:w-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden bg-white p-2">
          <Image 
            src={ipsLogo} 
            alt="Logo IPS" 
            width={32} 
            height={32} 
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>

      {/* 2. Bloque Central/Izquierdo (Título) */}
      <div className="flex flex-1 items-center px-4">
        <div className="hidden items-center sm:flex">
          <span className="text-lg font-semibold tracking-tight">Mapa Interactivo</span>
        </div>
      </div>

      {/* 3. Bloque Derecho (Usuario y Salir) */}
      <div className="ml-auto flex h-full items-center">
        {!loading && user && (
          <>
            {/* Avatar y Nombre */}
            <div className="hidden h-full items-center gap-3 border-l border-red-800/50 px-4 sm:flex">
              <Avatar className="h-9 w-9 border border-white/20">
                <AvatarFallback className="bg-slate-400 text-white font-medium">
                  {getInitials(user.email)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium opacity-90">{user.email}</span>
            </div>

            {/* Botón de Salir (La "X") */}
            <button 
              onClick={handleLogout}
              className="flex h-full w-16 shrink-0 items-center justify-center border-l border-red-800/50 hover:bg-red-800/30 transition-colors"
              title="Cerrar Sesión"
            >
              <X size={28} className="opacity-90 hover:opacity-100" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
