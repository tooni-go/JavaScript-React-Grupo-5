"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import MapaInteractivo from "@/components/mapa-interactivo";

export default function DashboardPage() {
  const [pisoActual, setPisoActual] = useState<"PB" | "Piso 1" | "Piso 2" | "Piso 3">("PB");
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    // Cargar el SVG desde el directorio public
    fetch("/PruebaPB.svg")
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error("Error al cargar el SVG:", err));
  }, []);

  return (
    <AuthGuard>
      <div className="container mx-auto p-4 md:p-8 flex flex-col h-full">
        {svgContent ? (
          <MapaInteractivo
            piso={pisoActual}
            onPisoChange={setPisoActual}
            svgContent={svgContent}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 animate-pulse font-medium">Cargando mapa interactivo...</p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
