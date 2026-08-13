"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X, Moon, Sun, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { referencias } from "@/data/referencias";

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
  const [referenciaDestacada, setReferenciaDestacada] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) setIsDark(true);
  }, []);

  const allAulaIds = useMemo(() => {
    const ids = new Set<string>();
    const regex = /id="(Aula-[^"]+)"/g;
    let match;
    while ((match = regex.exec(svgContent)) !== null) {
      ids.add(match[1]);
    }
    return Array.from(ids);
  }, [svgContent]);

  useEffect(() => {
    handleClosePopup();
    setReferenciaDestacada(null);
  }, [piso]);

  // Manejador de hover de alto rendimiento (sin React state) para agrupar elementos con IDs relacionados
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let styleEl = container.querySelector('#dynamic-hover-style') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-hover-style';
      container.appendChild(styleEl);
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const group = target.closest("[id^='Aula-']");
      if (group && group.id) {
        styleEl.textContent = `
          svg [id="${group.id}"], svg [id="${group.id}"] * {
            stroke: gold !important;
            stroke-width: 4px !important;
          }
        `;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      // Evitamos borrar el estilo si el mouse sigue dentro del mismo grupo
      const relatedTarget = e.relatedTarget as Element;
      if (relatedTarget && relatedTarget.closest && relatedTarget.closest("[id^='Aula-']")?.id === (e.target as Element).closest("[id^='Aula-']")?.id) {
        return;
      }
      styleEl.textContent = '';
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [svgContent]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const openPopupForAula = (aulaId: string) => {
    const el = document.getElementById(aulaId);
    const container = mapContainerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const x = elRect.left - containerRect.left + (elRect.width / 2);
      const y = elRect.top - containerRect.top + (elRect.height / 2);
      
      setAulaSeleccionada(aulaId);
      setPopupCoords({ x, y });
    }
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

  const getSearchSelectors = () => {
    if (!busqueda) return [];
    const term = busqueda.trim().toLowerCase();
    
    let regexStr = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Si empieza con número, asegurar que no esté precedido por otro número
    if (/^\d/.test(term)) {
      regexStr = `(?:^|[^0-9])${regexStr}`;
    }
    // Si termina con número, asegurar que no le siga otro número
    if (/\d$/.test(term)) {
      regexStr = `${regexStr}(?:[^0-9]|$)`;
    }
    
    try {
      const regex = new RegExp(regexStr, 'i');
      const matches = allAulaIds.filter(id => {
        const cleanId = id.replace(/^Aula-/, '').toLowerCase();
        return cleanId === term || regex.test(cleanId);
      });
      
      if (matches.length > 0) {
        return matches.map(id => `svg [id="${id}"]`);
      }
    } catch (e) {}
    
    const escapedTermForSelector = busqueda.replace(/"/g, '\\"');
    return [`svg [id^="Aula-"][id*="${escapedTermForSelector}" i]`];
  };

  const selectors = [
    ...getSearchSelectors(),
    referenciaDestacada ? `svg [id="${referenciaDestacada}"]` : null,
    (aulaSeleccionada && aulaSeleccionada !== referenciaDestacada) ? `svg [id="${aulaSeleccionada}"]` : null
  ].filter(Boolean);

  const activeCssRule = selectors.length > 0 
    ? `${selectors.map(sel => `${sel}, ${sel} *`).join(', ')} { stroke: gold !important; stroke-width: 4px !important; }` 
    : '';

  return (
    <div className="relative w-full h-full flex flex-col gap-4">
      <style>{`
        svg [id^="Aula-"] { transition: all 0.3s; cursor: pointer; }

        ${activeCssRule}
      `}</style>

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
      
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
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
        
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden">
          <Input 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            placeholder="Buscar aula..." 
            className="border-none w-full min-w-[200px] shadow-none focus-visible:ring-0" 
          />
        </div>
      </div>

      <div 
        ref={mapContainerRef}
        className="w-full flex-1 min-h-[500px] bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-auto mapa-container relative"
      >
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="w-full h-full"
          onClick={(e) => {
            const target = e.target as SVGElement;
            const parentGroup = target.closest("g[id^='Aula-']") || target.closest("[id^='Aula-']");
            if (parentGroup && parentGroup.id) {
              handleAulaClick(parentGroup.id, e);
            } else {
              handleClosePopup();
            }
          }}
        />
        
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
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Información no disponible</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 italic">Los horarios y asignaciones se cargarán próximamente.</p>
                </div>
              </CardContent>
            </Card>

            {/* Flecha Indicadora */}
            <div className="w-4 h-4 bg-card border-b border-r border-border rotate-45 -mt-[9px] z-[-1] shadow-sm"></div>
          </div>
        )}
      </div>

      {/* Referencias del piso */}
      <div className="w-full bg-[#1e293b] text-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center mb-6">
           <MapPin className="h-10 w-10 text-red-500 mb-2" strokeWidth={2.5} />
           <div className="flex items-center gap-8 text-white">
             <span className="text-2xl font-bold">←</span>
             <span className="text-2xl font-bold">→</span>
           </div>
        </div>
        {referencias[piso] ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm font-medium tracking-wide">
            {referencias[piso].map((ref, idx) => {
              if (ref.isSubtitle) {
                return (
                  <div key={`sub-${idx}`} className="col-span-1 md:col-span-2 mt-8 mb-2 pt-4 border-t border-slate-600/50 font-bold text-lg text-yellow-400 uppercase tracking-wider text-left">
                    {ref.nombre}
                  </div>
                );
              }
              return (
              <div 
                key={ref.id || idx}
                className={`flex items-start gap-2 cursor-pointer transition-colors p-2 rounded ${referenciaDestacada === ref.id ? 'bg-slate-700 text-yellow-400' : 'hover:bg-slate-800'}`}
                onMouseEnter={() => ref.id && setReferenciaDestacada(ref.id)}
                onMouseLeave={() => setReferenciaDestacada(null)}
                onClick={() => {
                  if (ref.id) {
                    setReferenciaDestacada(ref.id);
                    openPopupForAula(ref.id);
                    mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <span className="min-w-[24px] font-bold">{ref.num}-</span>
                <span>{ref.nombre}</span>
              </div>
            )})}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            Las referencias para el {piso} estarán disponibles próximamente...
          </div>
        )}
      </div>
    </div>
  );
}
