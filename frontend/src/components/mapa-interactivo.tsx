"use client";

import { useState, useEffect, useRef } from "react";
import { X, Moon, Sun, MapPin } from "lucide-react";
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

const referencias: Record<string, { id?: string, num?: number | string, nombre: string, isSubtitle?: boolean }[]> = {
  "PB": [
    { id: "Aula-Preceptoria", num: 1, nombre: "PRECEPTORÍA" },
    { id: "Aula-Dep-Electrotecnia", num: 2, nombre: "DEPARTAMENTO DE ELECTROTECNIA" },
    { id: "Aula-Lab-Electrotecnia", num: 3, nombre: "LABORATORIO DE ELECTROTECNIA" },
    { id: "Aula-Optica-Social", num: 4, nombre: "ÓPTICA SOCIAL" },
    { id: "Aula-Dep-Ed-Fisica", num: 5, nombre: "DEPARTAMENTO DE EDUCACIÓN FÍSICA" },
    { id: "Aula-Dep-Optica", num: 6, nombre: "DEPARTAMENTO DE ÓPTICA" },
    { id: "Aula-Servicios-Generales", num: 7, nombre: "SERVICIOS GENERALES" },
    { id: "Aula-Lab-Fotografia", num: 8, nombre: "LABORATORIO DE FOTOGRAFÍA" },
    { id: "Aula-Sec-Matematicas", num: 9, nombre: "SECRETARÍA DE MATEMÁTICAS" },
    { id: "Aula-Matematicas", num: 10, nombre: "AULA DE MATEMÁTICAS" },
    { id: "Aula-Dep-Matematicas", num: 11, nombre: "DEPARTAMENTO DE MATEMÁTICAS" },
    { id: "Aula-Dep-Humanas", num: 12, nombre: "DEPARTAMENTO DE CS. HUMANAS Y NATURALES" },
    { id: "Aula-Informes", num: 13, nombre: "INFORMES" },
    { isSubtitle: true, nombre: "TALLERES" },
    { id: "Aula-T13", num: "T13", nombre: "CENTRO TECNOLÓGICO DE PLÁSTICOS Y ELASTÓMEROS" },
    { id: "Aula-T14", num: "T14", nombre: "DEPARTAMENTO DE PLÁSTICOS Y ELASTÓMEROS" },
    { id: "Aula-T15", num: "T15", nombre: "DEPARTAMENTO DE MECÁNICA" },
    { id: "Aula-T18", num: "T18", nombre: "DEPARTAMENTO DE FORMACIÓN TECNOLÓGICA" },
    { id: "Aula-T19", num: "T19", nombre: "ENTREPISO: VICEDIRECCIÓN DE INFRAESTRUCTURA, EXTENSIÓN Y COMUNICACIÓN" },
    { id: "Aula-Biblioteca", num: 14, nombre: "BIBLIOTECA" },
    { id: "Aula-Sala-Profesores", num: 15, nombre: "SALA DE PROFESORES" },
    { id: "Aula-Concursos", num: 16, nombre: "OFICINA DE CONCURSOS" },
    { id: "Aula-Vicedireccion-Despacho", num: 17, nombre: "DESPACHO DE VICEDIRECCIÓN" },
    { id: "Aula-Regencia", num: 18, nombre: "REGENCIA" },
    { id: "Aula-Asuntos-Economicos", num: 19, nombre: "ASUNTOS ECONÓMICOS Y PATRIMONIALES" },
    { id: "Aula-Vicedireccion", num: 20, nombre: "VICEDIRECCIÓN" },
    { id: "Aula-Direccion-Despacho", num: 21, nombre: "DESPACHO DE DIRECCIÓN" },
    { id: "Aula-Direccion", num: 22, nombre: "DIRECCIÓN" },
    { id: "Aula-Sala-Reuniones", num: 23, nombre: "SALA DE REUNIONES" },
    { id: "Aula-Secretaria-Admin", num: 24, nombre: "SECRETARÍA ADMINISTRATIVA" },
    { id: "Aula-Personal", num: 25, nombre: "OFICINA DE PERSONAL" },
    { id: "Aula-Mesa-Entradas", num: 26, nombre: "MESA DE ENTRADAS" },
    { id: "Aula-Alumnado", num: 27, nombre: "ALUMNADO / SECRETARÍA DE INGRESO" },
    { id: "Aula-Cocina", num: 28, nombre: "COCINA DE PERSONAL" },
    { id: "Aula-Recursos-Pedagogicos", num: 29, nombre: "DEPARTAMENTO DE RECURSOS PEDAGÓGICOS" },
    { id: "Aula-Mariano-Moreno", num: 30, nombre: "AULA MARIANO MORENO" },
  ],
  "Piso 1": [
    { id: "Aula-Dep-Dibujo", num: 1, nombre: "DEPARTAMENTO DE DIBUJO" },
    { id: "Aula-Cafeteria", num: 2, nombre: "CAFETERÍA" },
    { id: "Aula-Dep-Cultura", num: 3, nombre: "DEPARTAMENTO DE CULTURA" },
    { id: "Aula-STG", num: 4, nombre: "SECRETARÍA DE TECNOLOGÍAS PARA LA GESTIÓN (STG)" },
    { id: "Aula-Cooperadora", num: 5, nombre: "ASOCIACIÓN COOPERADORA" },
    { id: "Aula-Secretaria-Estudiantil", num: 6, nombre: "SECRETARÍA DE ASUNTOS ESTUDIANTILES" },
    { id: "Aula-CEP", num: 7, nombre: "CENTRO DE ESTUDIANTES" },
    { id: "Aula-Libreria", num: 8, nombre: "LIBRERÍA" },
    { id: "Aula-Panol-STG", num: 9, nombre: "PAÑOL STG" },
    { id: "Aula-Lab-Informatica3", num: 10, nombre: "LABORATORIO N°3 DE INFORMÁTICA" },
    { id: "Aula-Dep-Idiomas", num: 11, nombre: "DEPARTAMENTO DE IDIOMAS" },
    { id: "Aula-Dep-Informatica", num: 12, nombre: "DEPARTAMENTO DE INFORMÁTICA" },
    { id: "Aula-Lab-Informatica1", num: 13, nombre: "LABORATORIO N°1 DE INFORMÁTICA" },
    { id: "Aula-Lab-Informatica2", num: 14, nombre: "LABORATORIO N°2 DE INFORMÁTICA" },
    { id: "Aula-Preceptoria", num: 15, nombre: "PRECEPTORÍA" },
    { id: "Aula-Equipo-Profesional-Orientacion", num: 16, nombre: "EQUIPO PROFESIONAL DE ORIENTACIÓN (EPO)" },
    { id: "Aula-Secretaria-ESI", num: 17, nombre: "SECRETARÍA DE ESI Y PERSPECTIVA DE GÉNERO" },
  ],
  "Piso 2": [
    { id: "Aula-Lab-Ambiental", num: 1, nombre: "LABORATORIO AMBIENTAL Y TERRAZA VERDE" },
    { id: "Aula-Dep-Construcciones", num: 2, nombre: "DEPARTAMENTO DE CONSTRUCCIONES" },
    { id: "Aula-EPO", num: 3, nombre: "EQUIPO PROFESIONAL DE ORIENTACIÓN (EPO) ASESORÍA PEDAGÓGICA" },
    { id: "Aula-Preceptoria", num: 4, nombre: "PRECEPTORÍA" },
    { id: "Aula-Dep-GyP", num: 5, nombre: "DEPARTAMENTO DE GESTIÓN Y PRODUCCIÓN" },
    { id: "Aula-Dep-Fisica", num: 6, nombre: "DEPARTAMENTO DE FÍSICA" },
  ],
  "Piso 3": [
    { id: "Aula-Droguero", num: 1, nombre: "DROGUERO" },
    { id: "Aula-Lab-Quimica3", num: 2, nombre: "LABORATORIO N°3 DE QUÍMICA" },
    { id: "Aula-Lab-Microbiologia", num: 3, nombre: "LABORATORIO MICROBIOLOGÍA" },
    { id: "Aula-Lab-Quimica2", num: 4, nombre: "LABORATORIO N°2 DE QUÍMICA" },
    { id: "Aula-Lab-Quimica1", num: 5, nombre: "LABORATORIO N°1 DE QUÍMICA" },
    { id: "Aula-Dep-EX", num: 6, nombre: "DEPARTAMENTO DE EXTENSIÓN CIENTÍFICA" },
    { id: "Aula-Preceptoria", num: 7, nombre: "PRECEPTORÍA" },
    { id: "Aula-Dep-Quimica", num: 8, nombre: "DEPARTAMENTO DE QUÍMICA" },
    { id: "Aula-Lactario", num: 9, nombre: "LACTARIO" },
  ]
};

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

  useEffect(() => {
    handleClosePopup();
    setReferenciaDestacada(null);
  }, [piso]);

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
      
      // Calculate center of the element relative to the container
      const x = elRect.left - containerRect.left + (elRect.width / 2);
      const y = elRect.top - containerRect.top + (elRect.height / 2);
      
      setAulaSeleccionada(aulaId);
      setPopupCoords({ x, y });
    }
  };

  const handleAulaClick = (aulaId: string, e: React.MouseEvent) => {
    // If clicked directly on the map, use the exact mouse position
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
    <div className="relative w-full h-full flex flex-col gap-4">
      {(busqueda || referenciaDestacada || aulaSeleccionada) && (
        <style>{`
          svg [id^="Aula-"] { transition: all 0.3s; }
          ${busqueda ? `
          svg [id^="Aula-"][id*="${busqueda}" i] { 
            stroke: gold !important; 
            stroke-width: 4px !important; 
            fill: rgba(255, 215, 0, 0.2) !important;
          }
          ` : ''}
          ${referenciaDestacada ? `
          svg [id="${referenciaDestacada}"] { 
            stroke: gold !important; 
            stroke-width: 4px !important; 
            fill: rgba(255, 215, 0, 0.4) !important;
          }
          ` : ''}
          ${(aulaSeleccionada && aulaSeleccionada !== referenciaDestacada) ? `
          svg [id="${aulaSeleccionada}"] { 
            stroke: gold !important; 
            stroke-width: 4px !important; 
            fill: rgba(255, 215, 0, 0.4) !important;
          }
          ` : ''}
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

      {/* Mapa SVG - Canvas Principal */}
      <div 
        ref={mapContainerRef}
        className="w-full flex-1 min-h-[500px] bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-auto mapa-container relative"
      >
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
                  <div key={`sub-${idx}`} className="mt-2 mb-1 font-bold text-lg text-yellow-400 uppercase tracking-wider">
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
