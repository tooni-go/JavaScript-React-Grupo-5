"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/providers/auth-provider";
import MapaInteractivo from "@/components/mapa-interactivo";
import Link from "next/link";
import { Megaphone, Settings, Video } from "lucide-react";

export default function MapaPage() {
  const { user } = useAuth();
  const [pisoActual, setPisoActual] = useState<"PB" | "Piso 1" | "Piso 2" | "Piso 3">("PB");
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${basePath}/PruebaPB.svg`)
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error("Error al cargar el SVG:", err));
  }, []);

  const isStudent = user?.rol === "ESTUDIANTE" || user?.rol === "PROFESOR";
  const isAdmin = user?.rol === "SUPERADMIN" || user?.rol === "ADMIN";

  return (
    <AuthGuard>
      <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
        {/* Mapa Canvas - Ocupa 100% del espacio disponible, sin sidebar */}
        <div className="w-full h-full">
          {svgContent ? (
            <MapaInteractivo
              piso={pisoActual}
              onPisoChange={setPisoActual}
              svgContent={svgContent}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-neutral-50 dark:bg-neutral-900">
              <p className="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
            </div>
          )}
        </div>

        {/* Botón Flotante Estudiantes - Espejo Izquierdo (bottom-left) */}
        {isStudent && (
          <div className="absolute bottom-8 left-4 md:left-8 z-50">
            <Link href="/dashboard/charlas">
              <button className="flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-medium text-white shadow-xl transition-all cursor-pointer hover:bg-violet-700 hover:shadow-2xl hover:-translate-y-0.5">
                <Video className="h-5 w-5" />
                <span>Ver Charlas</span>
              </button>
            </Link>
          </div>
        )}

        {/* Botón Flotante Admin - Espejo Derecho (bottom-right) */}
        {isAdmin && (
          <div className="absolute bottom-8 right-4 md:right-8 z-50">
            <Link href="/admin">
              <button className="flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-medium text-white shadow-xl transition-all cursor-pointer hover:bg-violet-700 hover:shadow-2xl hover:-translate-y-0.5">
                <Settings className="h-5 w-5" />
                <span>Panel de Admin</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
