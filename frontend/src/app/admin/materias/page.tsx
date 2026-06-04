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
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";

interface Asignacion {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  profesor: { nombre: string | null; email: string };
  materia: { id: number; nombre: string };
  curso: { id: number; nombre: string };
  aula: { id: number; nombre: string };
}

interface Materia {
  id: number;
  nombre: string;
  asignaciones: Asignacion[];
}

const emptyForm = { nombre: "" };

export default function MateriasPage() {
  const { user } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: { Authorization: `Bearer ${user?.accessToken}` },
  });

  useEffect(() => {
    fetchMaterias();
  }, []);

  async function fetchMaterias() {
    try {
      const res = await api.get("/materias");
      setMaterias(res.data);
    } catch (err) {
      console.error("Error al cargar materias:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setFormData(emptyForm);
    setOpenForm(true);
  }

  function openEdit(m: Materia) {
    setEditingId(m.id);
    setFormData({ nombre: m.nombre });
    setOpenForm(true);
  }

  async function handleSubmit() {
    if (!formData.nombre) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/materias/${editingId}`, formData);
      } else {
        await api.post("/materias", formData);
      }
      setOpenForm(false);
      fetchMaterias();
    } catch (err) {
      console.error("Error al guardar materia:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta materia?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/materias/${id}`);
      fetchMaterias();
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Materias
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administra el catálogo de materias y asignaturas curriculares.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Nueva Materia
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">Cargando...</div>
      ) : (
        <div className="rounded-md border dark:border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead>Nombre</TableHead>
                <TableHead>Asignaciones</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                    No hay materias registradas.
                  </TableCell>
                </TableRow>
              ) : (
                materias.map((m) => (
                  <TableRow key={m.id} className="dark:border-slate-700">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{m.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 text-xs font-medium">
                        {m.asignaciones?.length || 0} asignaciones
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(m)} className="cursor-pointer">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(m.id)}
                          disabled={deletingId === m.id}
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Materia" : "Nueva Materia"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ nombre: e.target.value })}
                placeholder="Ej: Programación"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || !formData.nombre} className="cursor-pointer">
              {submitting ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
