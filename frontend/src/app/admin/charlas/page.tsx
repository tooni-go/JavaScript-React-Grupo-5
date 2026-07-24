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
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api";

interface Aula {
  id: number;
  nombre: string;
  piso: number;
}

interface User {
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
  organizador: User;
  participantes: User[];
}

interface CharlaFormData {
  titulo: string;
  descripcion: string;
  capacidadMax: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  aulaId: number;
  organizadorId: string;
}

const emptyForm: CharlaFormData = {
  titulo: "",
  descripcion: "",
  capacidadMax: 30,
  fecha: "",
  horaInicio: "08:00",
  horaFin: "10:00",
  aulaId: 0,
  organizadorId: "",
};

export default function CharlasPage() {
  const { user } = useAuth();
  const [charlas, setCharlas] = useState<Charla[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CharlaFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCharlas();
    fetchAulas();
  }, []);

  async function fetchCharlas() {
    try {
      const res = await api.get("/charlas");
      setCharlas(res.data);
    } catch (err) {
      console.error("Error al cargar charlas:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAulas() {
    try {
      const res = await api.get("/aulas");
      setAulas(res.data);
    } catch (err) {
      console.error("Error al cargar aulas:", err);
    }
  }

  function openCreate() {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      organizadorId: user?.id || "",
      aulaId: aulas[0]?.id || 0,
    });
    setOpenForm(true);
  }

  function openEdit(c: Charla) {
    setEditingId(c.id);
    setFormData({
      titulo: c.titulo,
      descripcion: c.descripcion || "",
      capacidadMax: c.capacidadMax,
      fecha: c.fecha.split("T")[0],
      horaInicio: c.horaInicio,
      horaFin: c.horaFin,
      aulaId: c.aula.id,
      organizadorId: c.organizador.id,
    });
    setOpenForm(true);
  }

  async function handleSubmit() {
    if (!formData.titulo || !formData.fecha || !formData.aulaId) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        fecha: new Date(formData.fecha).toISOString(),
      };
      if (editingId) {
        await api.put(`/charlas/${editingId}`, payload);
      } else {
        await api.post("/charlas", payload);
      }
      setOpenForm(false);
      fetchCharlas();
    } catch (err) {
      console.error("Error al guardar charla:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta charla?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/charlas/${id}`);
      fetchCharlas();
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Charlas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administra eventos, conferencias y charlas extracurriculares.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Nueva Charla
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">
          Cargando...
        </div>
      ) : (
        <div className="rounded-md border dark:border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead>Título</TableHead>
                <TableHead>Aula</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Inscriptos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charlas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No hay charlas registradas.
                  </TableCell>
                </TableRow>
              ) : (
                charlas.map((c) => (
                  <TableRow key={c.id} className="dark:border-slate-700">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-violet-500" />
                        <span className="font-medium">{c.titulo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {c.aula.nombre}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(c.fecha)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {c.horaInicio} - {c.horaFin}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{c.capacidadMax}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full px-2 py-0.5">
                        <Users className="h-3 w-3" />
                        {c.participantes.length}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(c)}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(c.id)}
                          disabled={deletingId === c.id}
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
            <DialogTitle>
              {editingId ? "Editar Charla" : "Nueva Charla"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                placeholder="Ej: Introducción a la IA"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Descripción opcional..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Capacidad</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.capacidadMax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacidadMax: +e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hora inicio</Label>
                <Input
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) =>
                    setFormData({ ...formData, horaInicio: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Hora fin</Label>
                <Input
                  type="time"
                  value={formData.horaFin}
                  onChange={(e) =>
                    setFormData({ ...formData, horaFin: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Aula</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={formData.aulaId}
                onChange={(e) =>
                  setFormData({ ...formData, aulaId: +e.target.value })
                }
              >
                <option value={0}>Seleccionar aula...</option>
                {aulas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} (Piso {a.piso})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenForm(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !formData.titulo || !formData.fecha}
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
