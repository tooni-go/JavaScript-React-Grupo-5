"use client";

import { useState } from "react";
import axios from "axios";

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

interface MapaInteractivoProps {
  piso: number;
  onPisoChange: (piso: number) => void;
  svgContent: string;
}

export default function MapaInteractivo({
  piso,
  onPisoChange,
  svgContent,
}: MapaInteractivoProps) {
  const [aulaSeleccionada, setAulaSeleccionada] = useState<AulaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAulaClick = async (aulaId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar el aula por nombre (ej: "Aula-0-1" -> buscar aula con nombre "Aula-0-1")
      const response = await axios.get<AulaInfo>(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/aulas`,
        { params: { nombre: aulaId } }
      );
      
      if (response.data) {
        setAulaSeleccionada(response.data);
      } else {
        setError("No se encontró información para este aula");
      }
    } catch (err) {
      console.error("Error al obtener información del aula:", err);
      setError("No se pudo cargar la información del aula");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setAulaSeleccionada(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* Mapa SVG */}
      <div className="relative w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto">
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="w-full h-auto"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            // Detectar clics en elementos con ID que empiezan con "Aula-"
            if (target.id && target.id.startsWith("Aula-")) {
              handleAulaClick(target.id);
            }
          }}
        />
      </div>

      {/* Modal con información del aula */}
      {aulaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {aulaSeleccionada.nombre}
                  </h2>
                  <p className="text-gray-600">Piso {aulaSeleccionada.piso}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">Cargando información...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {!loading && !error && aulaSeleccionada && (
                <div className="space-y-6">
                  {/* Asignaciones/Clases */}
                  {aulaSeleccionada.asignaciones.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Clases Programadas
                      </h3>
                      <div className="space-y-3">
                        {aulaSeleccionada.asignaciones.map((asignacion) => (
                          <div
                            key={asignacion.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">
                                {asignacion.materia.nombre}
                              </h4>
                              <span className="text-sm text-gray-600">
                                {asignacion.diaSemana}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {asignacion.horaInicio} - {asignacion.horaFin}
                            </p>
                            <div className="text-sm text-gray-600">
                              <p>Profesor: {asignacion.profesor.nombre}</p>
                              <p>Curso: {asignacion.curso.nombre}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Charlas */}
                  {aulaSeleccionada.charlas.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Charlas Programadas
                      </h3>
                      <div className="space-y-3">
                        {aulaSeleccionada.charlas.map((charla) => (
                          <div
                            key={charla.id}
                            className="bg-indigo-50 rounded-lg p-4 border border-indigo-200"
                          >
                            <h4 className="font-medium text-gray-900 mb-2">
                              {charla.titulo}
                            </h4>
                            {charla.descripcion && (
                              <p className="text-sm text-gray-600 mb-2">
                                {charla.descripcion}
                              </p>
                            )}
                            <div className="text-sm text-gray-600">
                              <p>
                                Fecha:{" "}
                                {new Date(charla.fechaHora).toLocaleString()}
                              </p>
                              <p>Capacidad: {charla.capacidadMax} personas</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aulaSeleccionada.asignaciones.length === 0 &&
                    aulaSeleccionada.charlas.length === 0 && (
                      <p className="text-gray-600 text-center py-4">
                        No hay clases ni charlas programadas en este aula.
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
