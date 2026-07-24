"use client";

import { useState, useEffect } from "react";
import { X, Moon, Sun } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AulaInfo {
  id: number;
  nombre: string;
  piso: number;
  asignaciones: Array<{
    id: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    profesor: {
      nombre: string;
      email: string;
    };
    materia: {
      nombre: string;
    };
    curso: {
      nombre: string;
    };
  }>;
  charlas: Array<{
    id: number;
    titulo: string;
    descripcion: string | null;
    fechaHora: string;
    capacidadMax: number;
  }>;
}

type PisoType = "PB" | "Piso 1" | "Piso 2" | "Piso 3";

interface MapaInteractivoProps {
  piso: PisoType;
  onPisoChange: (piso: PisoType) => void;
  svgContent: string;
}

export default function MapaInteractivo({
  piso,
  onPisoChange,
  svgContent,
}: MapaInteractivoProps) {
  const [aulaSeleccionada, setAulaSeleccionada] = useState<string | null>(null);
  const [popupCoords, setPopupCoords] = useState<{ x: number; y: number } | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) setIsDark(true);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const handleAulaClick = (aulaId: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setAulaSeleccionada(aulaId);
    setPopupCoords({ x, y });
  };

  const handleClosePopup = () => {
    setAulaSeleccionada(null);
    setPopupCoords(null);
  };

  return (
    <div className="relative w-full h-full">
      {busqueda && (
        <style>{`
          svg [id^="Aula-"] { transition: all 0.3s; }
          svg [id^="Aula-"][id*="${busqueda}" i] { 
            stroke: gold !important; 
            stroke-width: 4px !important; 
            fill: rgba(255, 215, 0, 0.2) !important;
          }
        `}</style>
      )}

      {/* Botón Tema Oscuro (Top Right) */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Controles Superiores Izquierdos */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* Selector de Pisos */}
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md border border-gray-200 dark:border-slate-700 flex overflow-hidden">
          {[
            { label: "PB", value: "PB" as PisoType },
            { label: "Piso 1", value: "Piso 1" as PisoType },
            { label: "Piso 2", value: "Piso 2" as PisoType },
            { label: "Piso 3", value: "Piso 3" as PisoType },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => onPisoChange(p.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                piso === p.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        
        {/* Buscador de Aulas */}
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden">
          <Input 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            placeholder="Buscar aula..." 
            className="border-none w-full min-w-[200px] shadow-none focus-visible:ring-0" 
          />
        </div>
      </div>

      {/* Mapa SVG - Canvas Principal Full Width */}
      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-auto mapa-container">
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="w-full h-full cursor-pointer"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.id && target.id.startsWith("Aula-")) {
              handleAulaClick(target.id, e);
            } else {
              handleClosePopup();
            }
          }}
        />
      </div>

      {/* Pop-up Flotante de Información del Aula */}
      {aulaSeleccionada && popupCoords && (
        <div 
          className="absolute z-50 flex flex-col items-center pointer-events-none transition-all duration-200"
          style={{ 
            top: popupCoords.y, 
            left: popupCoords.x, 
            transform: 'translate(-50%, -100%)',
            marginTop: '-12px'
          }}
        >
          <Card className="w-64 shadow-2xl pointer-events-auto border-border bg-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between p-4">
              <CardTitle className="text-sm font-bold">
                {aulaSeleccionada.replace(/-/g, " ")}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full" 
                onClick={handleClosePopup}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </CardHeader>
            <CardContent className="text-sm p-4 pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Ocupada</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">Materia:</span> Matemática Aplicada</p>
                <p className="text-gray-600 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">Profesor:</span> Juan Pérez</p>
                <p className="text-gray-600 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">Horario:</span> 10:00 - 12:00</p>
              </div>
            </CardContent>
          </Card>

          {/* Flecha Indicadora */}
          <div className="w-4 h-4 bg-card border-b border-r border-border rotate-45 -mt-[9px] z-[-1] shadow-sm"></div>
        </div>
      )}
    </div>
  );
}
