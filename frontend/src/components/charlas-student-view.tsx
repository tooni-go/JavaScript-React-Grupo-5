"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

interface Aula {
  id: number;
  nombre: string;
  piso: number;
}

interface Organizador {
  id: string;
  nombre: string | null;
  email: string;
}

interface Charla {
  id: number;
  titulo: string;
  descripcion: string | null;
  capacidadMax: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  aula: Aula;
  organizador: Organizador;
  participantes: { id: string }[];
}

interface CharlasStudentViewProps {
  open: boolean;
  onClose: () => void;
}

export default function CharlasStudentView({ open, onClose }: CharlasStudentViewProps) {
  const { user } = useAuth();
  const [charlas, setCharlas] = useState<Charla[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: { Authorization: `Bearer ${user?.accessToken}` },
  });

  useEffect(() => {
    if (open) {
      fetchCharlas();
    }
  }, [open]);

  async function fetchCharlas() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.get("/charlas");
      const upcoming = (res.data as Charla[]).filter(
        (c) => new Date(c.fecha) >= new Date()
      );
      setCharlas(upcoming.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()));
    } catch (err) {
      setMessage({ type: "error", text: "No se pudieron cargar las charlas." });
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(charlaId: number) {
    setActing(charlaId);
    setMessage(null);
    try {
      await api.post(`/charlas/${charlaId}/participantes/${user?.id}`);
      setMessage({ type: "success", text: "¡Te inscribiste correctamente!" });
      fetchCharlas();
    } catch {
      setMessage({ type: "error", text: "No se pudo completar la inscripción." });
    } finally {
      setActing(null);
    }
  }

  async function handleLeave(charlaId: number) {
    setActing(charlaId);
    setMessage(null);
    try {
      await api.delete(`/charlas/${charlaId}/participantes/${user?.id}`);
      setMessage({ type: "success", text: "Saliste de la charla." });
      fetchCharlas();
    } catch {
      setMessage({ type: "error", text: "No se pudo salir de la charla." });
    } finally {
      setActing(null);
    }
  }

  function isJoined(charla: Charla): boolean {
    return charla.participantes.some((p) => p.id === user?.id);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function isFull(charla: Charla): boolean {
    return charla.participantes.length >= charla.capacidadMax;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-violet-500" />
            Charlas Disponibles
          </DialogTitle>
        </DialogHeader>

        {message && (
          <div
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Cargando charlas...
          </div>
        ) : charlas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Megaphone className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No hay charlas disponibles</p>
            <p className="text-sm text-slate-400 mt-1">
              Pronto se habilitarán nuevas actividades.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {charlas.map((charla) => {
              const joined = isJoined(charla);
              const full = isFull(charla);
              const spotsLeft = charla.capacidadMax - charla.participantes.length;

              return (
                <div
                  key={charla.id}
                  className={`rounded-lg border p-4 transition-colors ${
                    joined
                      ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                        {charla.titulo}
                      </h3>
                      {charla.descripcion && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {charla.descripcion}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(charla.fecha)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {charla.horaInicio} - {charla.horaFin}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {charla.aula.nombre}
                        </span>
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            full ? "text-red-500" : "text-slate-500"
                          }`}
                        >
                          <Users className="h-3 w-3" />
                          {charla.participantes.length}/{charla.capacidadMax}
                          {!joined && !full && ` (${spotsLeft} lugares)`}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {joined ? (
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
                            <CheckCircle className="h-3 w-3" />
                            Inscripto
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={acting === charla.id}
                            onClick={() => handleLeave(charla.id)}
                            className="gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 cursor-pointer"
                          >
                            {acting === charla.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : null}
                            Salir
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          disabled={full || acting === charla.id}
                          onClick={() => handleJoin(charla.id)}
                          className="gap-1 cursor-pointer"
                        >
                          {acting === charla.id ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Unirse
                            </>
                          ) : full ? (
                            "Completo"
                          ) : (
                            "Unirse"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}