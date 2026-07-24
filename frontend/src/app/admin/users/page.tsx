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
import { Users, Plus, Pencil, Trash2, Shield, UserCheck, Hourglass, Loader2, X, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

interface Curso {
  id: number;
  nombre: string;
}

interface UserData {
  id: string;
  email: string;
  nombre: string | null;
  rol: string | null;
  curso: Curso | null;
}

interface UserFormData {
  email: string;
  password: string;
  nombre: string;
  rol: string;
  cursoId: number | null;
}

const roles = ["ESTUDIANTE", "PROFESOR", "SUPERADMIN"];

const emptyForm: UserFormData = {
  email: "",
  password: "",
  nombre: "",
  rol: "ESTUDIANTE",
  cursoId: null,
};

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvalRoles, setApprovalRoles] = useState<Record<string, string>>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);
  const [userToReject, setUserToReject] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchCursos();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCursos() {
    try {
      const res = await api.get("/cursos");
      setCursos(res.data);
    } catch (err) {
      console.error("Error al cargar cursos:", err);
    }
  }

  const activeUsers = users.filter((u) => u.rol !== null && u.rol !== undefined && u.rol !== "");
  const pendingUsers = users.filter((u) => u.rol === null || u.rol === undefined || u.rol === "");

  function openCreate() {
    setEditingId(null);
    setFormData(emptyForm);
    setOpenForm(true);
  }

  function openEdit(u: UserData) {
    setEditingId(u.id);
    setFormData({
      email: u.email,
      password: "",
      nombre: u.nombre || "",
      rol: u.rol || "ESTUDIANTE",
      cursoId: u.curso?.id || null,
    });
    setOpenForm(true);
  }

  async function handleSubmit() {
    if (!formData.email) return;
    setSubmitting(true);
    try {
      const payload: any = { ...formData };
      if (editingId && !payload.password) {
        delete payload.password;
      }
      if (editingId) {
        await api.put(`/users/${editingId}`, payload);
      } else {
        await api.post("/users", payload);
      }
      setOpenForm(false);
      fetchUsers();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleApprove(userId: string) {
    const selectedRol = approvalRoles[userId];
    if (!selectedRol) return;
    setApprovingId(userId);
    try {
      await api.put(`/users/${userId}`, { rol: selectedRol });
      setApprovalRoles((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      fetchUsers();
    } catch (err) {
      console.error("Error al aprobar usuario:", err);
    } finally {
      setApprovingId(null);
    }
  }

  function openRejectConfirm(user: UserData) {
    setUserToReject(user);
    setConfirmRejectOpen(true);
  }

  async function handleReject() {
    if (!userToReject) return;
    setRejectingId(userToReject.id);
    try {
      await api.delete(`/users/${userToReject.id}/reject`);
      fetchUsers();
      setConfirmRejectOpen(false);
      setUserToReject(null);
    } catch (err) {
      console.error("Error al rechazar usuario:", err);
    } finally {
      setRejectingId(null);
    }
  }

  function rolBadge(rol: string | null) {
    if (!rol) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    const map: Record<string, string> = {
      SUPERADMIN: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
      PROFESOR: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      ESTUDIANTE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
    return map[rol] || "bg-slate-100 text-slate-800";
  }

  function rolLabel(rol: string | null) {
    if (!rol) return "Pendiente";
    const map: Record<string, string> = {
      SUPERADMIN: "Super Admin",
      PROFESOR: "Profesor",
      ESTUDIANTE: "Estudiante",
    };
    return map[rol] || rol;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Usuarios
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administra los perfiles, roles y permisos de los usuarios del sistema.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">Cargando...</div>
      ) : (
        <>
          <div className="rounded-md border dark:border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No hay usuarios con rol asignado.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeUsers.map((u) => (
                    <TableRow key={u.id} className="dark:border-slate-700">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-indigo-500" />
                          <span className="font-medium">{u.nombre || "Sin nombre"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{u.email}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${rolBadge(u.rol)}`}>
                          <Shield className="h-3 w-3" />
                          {rolLabel(u.rol)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{u.curso?.nombre || "—"}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(u)} className="cursor-pointer">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(u.id)}
                            disabled={deletingId === u.id}
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

          {pendingUsers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pt-4">
                <Hourglass className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Nuevos Usuarios Registrados
                </h2>
                <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 text-xs font-medium">
                  {pendingUsers.length}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Estos usuarios se registraron y están esperando la asignación de un rol.
              </p>
              <div className="rounded-md border border-amber-200 dark:border-amber-800">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50 dark:bg-amber-900/20">
                      <TableHead>Email</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Asignar Rol</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers.map((u) => (
                      <TableRow key={u.id} className="dark:border-slate-700">
                        <TableCell>
                          <span className="text-sm font-medium">{u.email}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{u.nombre || "—"}</span>
                        </TableCell>
                        <TableCell>
                          <select
                            className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm"
                            value={approvalRoles[u.id] || ""}
                            onChange={(e) =>
                              setApprovalRoles({ ...approvalRoles, [u.id]: e.target.value })
                            }
                          >
                            <option value="">Seleccionar rol...</option>
                            {roles.map((r) => (
                              <option key={r} value={r}>
                                {rolLabel(r)}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              disabled={!approvalRoles[u.id] || approvingId === u.id}
                              onClick={() => handleApprove(u.id)}
                              className="gap-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white"
                            >
                              {approvingId === u.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <UserCheck className="h-3 w-3" />
                              )}
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={rejectingId === u.id}
                              onClick={() => openRejectConfirm(u)}
                              className="gap-1 cursor-pointer text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                              {rejectingId === u.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                              Rechazar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <Label>{editingId ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña"}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingId ? "••••••••" : "Mínimo 6 caracteres"}
              />
            </div>
            <div>
              <Label>Rol</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{rolLabel(r)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Curso (solo para Estudiantes)</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={formData.cursoId ?? ""}
                onChange={(e) => setFormData({ ...formData, cursoId: e.target.value ? +e.target.value : null })}
              >
                <option value="">Sin curso</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || !formData.email} className="cursor-pointer">
              {submitting ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación de rechazo */}
      <Dialog open={confirmRejectOpen} onOpenChange={setConfirmRejectOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Rechazo
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600">
              ¿Estás seguro de que querés rechazar y eliminar al usuario{" "}
              <span className="font-semibold">{userToReject?.email}</span>?
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmRejectOpen(false);
                setUserToReject(null);
              }}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejectingId !== null}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
            >
              {rejectingId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Rechazar y Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

