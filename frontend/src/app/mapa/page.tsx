"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import MapaInteractivo from "@/components/mapa-interactivo";

export default function MapaPage() {
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
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Mapa Interactivo del Poli
        </h1>
        
        {svgContent ? (
          <MapaInteractivo
            piso={pisoActual}
            onPisoChange={setPisoActual}
            svgContent={svgContent}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        )}
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Haz clic en las aulas marcadas (Aula-0-1, Aula-0-2, Aula-0-3, Aula-0-5, Aula-0-8, Aula-0-9, Aula-Patio-Verde)</li>
            <li>Verás las clases programadas, profesores y horarios</li>
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
}
