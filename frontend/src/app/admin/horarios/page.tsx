"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, Plus, Pencil, Trash2, Clock, MapPin, BookOpen, Users, AlertCircle } from "lucide-react";
import axios from "axios";

interface Asignacion {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  profesor: { id: string; nombre: string | null; email: string };
  materia: { id: number; nombre: string };
  curso: { id: number; nombre: string };
  aula: { id: number; nombre: string };
}

interface Option {
  id: number | string;
  nombre: string;
}

interface AsignacionFormData {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  profesorId: string;
  cursoId: number;
  materiaId: number;
  aulaId: number;
}

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const emptyForm: AsignacionFormData = {
  diaSemana: "Lunes",
  horaInicio: "08:00",
  horaFin: "10:00",
  profesorId: "",
  cursoId: 0,
  materiaId: 0,
  aulaId: 0,
};

export default function HorariosPage() {
  const { user } = useAuth();
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [profesores, setProfesores] = useState<Option[]>([]);
  const [cursos, setCursos] = useState<Option[]>([]);
  const [materias, setMaterias] = useState<Option[]>([]);
  const [aulas, setAulas] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AsignacionFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: { Authorization: `Bearer ${user?.accessToken}` },
  });

  useEffect(() => {
    fetchAsignaciones();
    fetchOptions();
  }, []);

  async function fetchAsignaciones() {
    try {
      const res = await api.get("/asignaciones");
      setAsignaciones(res.data);
    } catch (err) {
      console.error("Error al cargar asignaciones:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOptions() {
    try {
      const [uRes, cRes, mRes, aRes] = await Promise.all([
        api.get("/users"),
        api.get("/cursos"),
        api.get("/materias"),
        api.get("/aulas"),
      ]);
      setProfesores(
        (uRes.data as any[]).filter((u: any) => u.rol === "PROFESOR").map((u: any) => ({ id: u.id, nombre: u.nombre || u.email }))
      );
      setCursos((cRes.data as any[]).map((c: any) => ({ id: c.id, nombre: c.nombre })));
      setMaterias((mRes.data as any[]).map((m: any) => ({ id: m.id, nombre: m.nombre })));
      setAulas((aRes.data as any[]).map((a: any) => ({ id: a.id, nombre: a.nombre })));
    } catch (err) {
      console.error("Error al cargar opciones:", err);
    }
  }

  function openCreate() {
    setEditingId(null);
    setFormError(null);
    setFormData({
      ...emptyForm,
      profesorId: profesores[0]?.id as string || "",
      cursoId: (cursos[0]?.id as number) || 0,
      materiaId: (materias[0]?.id as number) || 0,
      aulaId: (aulas[0]?.id as number) || 0,
    });
    setOpenForm(true);
  }

  function openEdit(a: Asignacion) {
    setEditingId(a.id);
    setFormError(null);
    setFormData({
      diaSemana: a.diaSemana,
      horaInicio: a.horaInicio,
      horaFin: a.horaFin,
      profesorId: a.profesor.id,
      cursoId: a.curso.id,
      materiaId: a.materia.id,
      aulaId: a.aula.id,
    });
    setOpenForm(true);
  }

  function validateTimeRange(): boolean {
    const [startHours, startMinutes] = formData.horaInicio.split(':').map(Number);
    const [endHours, endMinutes] = formData.horaFin.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    if (endTotalMinutes <= startTotalMinutes) {
      setFormError('La hora de finalización debe ser posterior a la hora de inicio.');
      return false;
    }
    
    setFormError(null);
    return true;
  }

  async function handleSubmit() {
    if (!formData.profesorId || !formData.cursoId || !formData.materiaId || !formData.aulaId) return;
    
    // Validate time range before submitting
    if (!validateTimeRange()) return;
    
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/asignaciones/${editingId}`, formData);
      } else {
        await api.post("/asignaciones", formData);
      }
      setOpenForm(false);
      fetchAsignaciones();
    } catch (err: any) {
      console.error("Error al guardar asignación:", err);
      if (err?.response?.data?.message) {
        setFormError(err.response.data.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta asignación?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/asignaciones/${id}`);
      fetchAsignaciones();
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      setDeletingId(null);
    }
  }

  function selectField(label: string, value: number | string, onChange: (v: string) => void, options: Option[]) {
    return (
      <div>
        <Label>{label}</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Seleccionar...</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>{o.nombre}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Horarios
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administra la grilla horaria semanal y las asignaciones regulares.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Nueva Asignación
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">Cargando...</div>
      ) : (
        <div className="rounded-md border dark:border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead>Día</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Profesor</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Aula</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asignaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No hay asignaciones registradas.
                  </TableCell>
                </TableRow>
              ) : (
                asignaciones.map((a) => (
                  <TableRow key={a.id} className="dark:border-slate-700">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{a.diaSemana}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {a.horaInicio} - {a.horaFin}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <BookOpen className="h-3 w-3 text-blue-500" />
                        {a.materia.nombre}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3 w-3" />
                        {a.profesor.nombre || a.profesor.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{a.curso.nombre}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {a.aula.nombre}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(a)} className="cursor-pointer">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(a.id)}
                          disabled={deletingId === a.id}
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Asignación" : "Nueva Asignación"}</DialogTitle>
          </DialogHeader>
          
          {formError && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-3 py-2 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Label>Día</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={formData.diaSemana}
                onChange={(e) => setFormData({ ...formData, diaSemana: e.target.value })}
              >
                {dias.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hora inicio</Label>
                <Input
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => {
                    setFormData({ ...formData, horaInicio: e.target.value });
                    setFormError(null);
                  }}
                />
              </div>
              <div>
                <Label>Hora fin</Label>
                <Input
                  type="time"
                  value={formData.horaFin}
                  onChange={(e) => {
                    setFormData({ ...formData, horaFin: e.target.value });
                    setFormError(null);
                  }}
                />
              </div>
            </div>
            {selectField("Profesor", formData.profesorId, (v) => setFormData({ ...formData, profesorId: v }), profesores)}
            {selectField("Curso", formData.cursoId, (v) => setFormData({ ...formData, cursoId: +v }), cursos)}
            {selectField("Materia", formData.materiaId, (v) => setFormData({ ...formData, materiaId: +v }), materias)}
            {selectField("Aula", formData.aulaId, (v) => setFormData({ ...formData, aulaId: +v }), aulas)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !formData.profesorId || !formData.cursoId}
              className="cursor-pointer"
            >
              {submitting ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
