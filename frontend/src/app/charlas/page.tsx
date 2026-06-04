"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/providers/auth-provider";
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
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
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

export default function CharlasEnrollmentPage() {
  const { user } = useAuth();
  const [charlas, setCharlas] = useState<Charla[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: { Authorization: `Bearer ${user?.accessToken}` },
  });

  useEffect(() => {
    fetchCharlas();
  }, []);

  async function fetchCharlas() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.get("/charlas");
      const upcoming = (res.data as Charla[]).filter(
        (c) => new Date(c.fecha) >= new Date()
      );
      setCharlas(
        upcoming.sort(
          (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        )
      );
    } catch {
      setMessage({ type: "error", text: "No se pudieron cargar las charlas." });
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll(charlaId: number) {
    setActing(charlaId);
    setMessage(null);
    try {
      await api.post(`/charlas/${charlaId}/participantes/${user?.id}`);
      setMessage({ type: "success", text: "¡Te inscribiste correctamente!" });
      fetchCharlas();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "No se pudo completar la inscripción.";
      setMessage({ type: "error", text: msg });
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

  function isJoined(charla: Charla) {
    return charla.participantes.some((p) => p.id === user?.id);
  }

  function isFull(charla: Charla) {
    return charla.participantes.length >= charla.capacidadMax;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const enrolled = charlas.filter(isJoined);
  const available = charlas.filter((c) => !isJoined(c));

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/mapa">
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="h-6 w-6 text-violet-500" />
                Charlas Disponibles
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Inscribite en las charlas y eventos extracurriculares del Poli.
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 rounded-md px-4 py-3 text-sm mb-6 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              )}
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16 text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Cargando charlas...
            </div>
          ) : charlas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Megaphone className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium text-lg">
                No hay charlas disponibles
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Pronto se habilitarán nuevas actividades.
              </p>
            </div>
          ) : (
            <>
              {enrolled.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Mis Inscripciones ({enrolled.length})
                  </h2>
                  <div className="space-y-3">
                    {enrolled.map((charla) => (
                      <div
                        key={charla.id}
                        className="rounded-lg border border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {charla.titulo}
                            </h3>
                            {charla.descripcion && (
                              <p className="text-sm text-slate-500 mt-1">
                                {charla.descripcion}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(charla.fecha)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {charla.horaInicio} - {charla.horaFin}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {charla.aula.nombre}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {charla.participantes.length}/{charla.capacidadMax} cupos
                              </span>
                            </div>
                            {charla.organizador.nombre && (
                              <p className="text-sm text-slate-500 mt-2">
                                Disertante: {charla.organizador.nombre}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end gap-2">
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
                              Darme de baja
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {available.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-violet-500" />
                    Próximas Charlas ({available.length})
                  </h2>
                  <div className="space-y-3">
                    {available.map((charla) => {
                      const full = isFull(charla);
                      const spotsLeft =
                        charla.capacidadMax - charla.participantes.length;

                      return (
                        <div
                          key={charla.id}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {charla.titulo}
                              </h3>
                              {charla.descripcion && (
                                <p className="text-sm text-slate-500 mt-1">
                                  {charla.descripcion}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(charla.fecha)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {charla.horaInicio} - {charla.horaFin}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {charla.aula.nombre}
                                </span>
                                <span
                                  className={`flex items-center gap-1 font-medium ${
                                    full
                                      ? "text-red-500"
                                      : "text-slate-500"
                                  }`}
                                >
                                  <Users className="h-4 w-4" />
                                  {charla.participantes.length}/{charla.capacidadMax} cupos
                                  {!full && ` (${spotsLeft} disponibles)`}
                                </span>
                              </div>
                              {charla.organizador.nombre && (
                                <p className="text-sm text-slate-500 mt-2">
                                  Disertante: {charla.organizador.nombre}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <Button
                                disabled={full || acting === charla.id}
                                onClick={() => handleEnroll(charla.id)}
                                className="gap-1 cursor-pointer"
                              >
                                {acting === charla.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Inscribirse
                                  </>
                                ) : full ? (
                                  "Sin Cupos"
                                ) : (
                                  "Inscribirse"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
