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
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";

interface Aula {
  id: number;
  nombre: string;
  piso: number;
  capacidad: number;
  estado: string;
}

interface AulaFormData {
  nombre: string;
  piso: number;
  capacidad: number;
  estado: string;
}

const emptyForm: AulaFormData = {
  nombre: "",
  piso: 0,
  capacidad: 30,
  estado: "disponible",
};

const estados = ["disponible", "ocupada", "mantenimiento"];

export default function AulasPage() {
  const { user } = useAuth();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AulaFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: { Authorization: `Bearer ${user?.accessToken}` },
  });

  useEffect(() => {
    fetchAulas();
  }, []);

  async function fetchAulas() {
    try {
      const res = await api.get("/aulas");
      setAulas(res.data);
    } catch (err) {
      console.error("Error al cargar aulas:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setFormData(emptyForm);
    setOpenForm(true);
  }

  function openEdit(a: Aula) {
    setEditingId(a.id);
    setFormData({
      nombre: a.nombre,
      piso: a.piso,
      capacidad: a.capacidad,
      estado: a.estado,
    });
    setOpenForm(true);
  }

  async function handleSubmit() {
    if (!formData.nombre) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/aulas/${editingId}`, formData);
      } else {
        await api.post("/aulas", formData);
      }
      setOpenForm(false);
      fetchAulas();
    } catch (err) {
      console.error("Error al guardar aula:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta aula?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/aulas/${id}`);
      fetchAulas();
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      setDeletingId(null);
    }
  }

  function estadoBadge(estado: string) {
    const map: Record<string, string> = {
      disponible: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      ocupada: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      mantenimiento: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return map[estado] || "bg-slate-100 text-slate-800";
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Aulas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administra los espacios físicos, capacidad y estado del establecimiento.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Nueva Aula
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
                <TableHead>Piso</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aulas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No hay aulas registradas.
                  </TableCell>
                </TableRow>
              ) : (
                aulas.map((a) => (
                  <TableRow key={a.id} className="dark:border-slate-700">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-indigo-500" />
                        <span className="font-medium">{a.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{a.piso === 0 ? "PB" : `Piso ${a.piso}`}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{a.capacidad} alumnos</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${estadoBadge(a.estado)}`}>
                        {a.estado}
                      </span>
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
            <DialogTitle>{editingId ? "Editar Aula" : "Nueva Aula"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Laboratorio 1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Piso</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.piso}
                  onChange={(e) => setFormData({ ...formData, piso: +e.target.value })}
                />
              </div>
              <div>
                <Label>Capacidad</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.capacidad}
                  onChange={(e) => setFormData({ ...formData, capacidad: +e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Estado</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                {estados.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
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
