"use client";

import { useState, useEffect } from "react";
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
  Users, 
  Settings, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  Clock, 
  BookOpen,
  MapPin,
  Pencil,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface Curso {
  id: number;
  nombre: string;
  estudiantes?: any[];
  asignaciones?: any[];
}

interface Option {
  id: number | string;
  nombre: string;
}

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [deletedCursos, setDeletedCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  
  // Modal states for delete/restore
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'restore' | 'hardDelete', cursoId: number, nombre: string } | null>(null);
  const [genericConfirm, setGenericConfirm] = useState<{ title: string, description: string, action: () => void } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // States for main view
  const [openForm, setOpenForm] = useState(false);
  const [nombreCurso, setNombreCurso] = useState("");
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);

  // States for detail view
  const [cursoDetail, setCursoDetail] = useState<Curso | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState("");
  
  // States for schedule editing in detail view
  const [openScheduleForm, setOpenScheduleForm] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState({
    diaSemana: "Lunes",
    horaInicio: "08:00",
    horaFin: "10:00",
    profesorId: "",
    materiaId: 0,
    aulaId: 0,
  });
  const [profesores, setProfesores] = useState<Option[]>([]);
  const [materias, setMaterias] = useState<Option[]>([]);
  const [aulas, setAulas] = useState<Option[]>([]);
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  useEffect(() => {
    fetchCursos();
    fetchOptions();
  }, []);

  useEffect(() => {
    if (selectedCursoId) {
      fetchCursoDetail(selectedCursoId);
    }
    const main = document.getElementById("main-scroll-container");
    if (main) {
      main.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [selectedCursoId]);

  async function fetchCursos() {
    setLoading(true);
    try {
      const [activeRes, deletedRes] = await Promise.all([
        api.get("/cursos"),
        api.get("/cursos?deleted=true")
      ]);
      setCursos(activeRes.data);
      setDeletedCursos(deletedRes.data);
    } catch (err) {
      console.error("Error al cargar cursos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOptions() {
    try {
      const [uRes, mRes, aRes] = await Promise.all([
        api.get("/users"),
        api.get("/materias"),
        api.get("/aulas"),
      ]);
      setProfesores(
        (uRes.data as any[]).filter((u: any) => u.rol === "PROFESOR").map((u: any) => ({ id: u.id, nombre: u.nombre || u.email }))
      );
      setMaterias((mRes.data as any[]).map((m: any) => ({ id: m.id, nombre: m.nombre })));
      setAulas((aRes.data as any[]).map((a: any) => ({ id: a.id, nombre: a.nombre })));
    } catch (err) {
      console.error("Error al cargar opciones:", err);
    }
  }

  async function fetchCursoDetail(id: number) {
    setLoadingDetail(true);
    try {
      const res = await api.get(`/cursos/${id}`);
      setCursoDetail(res.data);
    } catch (err) {
      console.error("Error fetching detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  }

  // ---- MAIN CURSOS CRUD ----
  async function saveCurso() {
    if (!nombreCurso) return;
    try {
      if (editingCurso) {
        await api.put(`/cursos/${editingCurso.id}`, { nombre: nombreCurso });
      } else {
        await api.post("/cursos", { nombre: nombreCurso });
      }
      setOpenForm(false);
      fetchCursos();
      if (selectedCursoId) fetchCursoDetail(selectedCursoId);
      setSuccessMessage("¡Nombre cambiado correctamente!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleConfirmAction() {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'delete') {
        await api.delete(`/cursos/${confirmAction.cursoId}`);
      } else if (confirmAction.type === 'restore') {
        await api.post(`/cursos/${confirmAction.cursoId}/restore`);
      } else if (confirmAction.type === 'hardDelete') {
        await api.delete(`/cursos/${confirmAction.cursoId}/hard`);
      }
      setConfirmAction(null);
      fetchCursos();
    } catch (err) {
      console.error(err);
    }
  }

  // ---- STUDENTS MANAGEMENT ----
  async function loadAvailableStudents() {
    try {
      const res = await api.get("/users");
      const students = res.data.filter((u: any) => u.rol === "ESTUDIANTE" && u.cursoId !== selectedCursoId);
      setAvailableStudents(students);
      setSelectedStudentToAdd("");
      setOpenAddStudent(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function addStudentToCourse() {
    if (!selectedStudentToAdd || !selectedCursoId) return;
    try {
      await api.put(`/users/${selectedStudentToAdd}`, { cursoId: selectedCursoId });
      setOpenAddStudent(false);
      fetchCursoDetail(selectedCursoId);
    } catch (err) {
      console.error(err);
    }
  }

  async function removeStudentFromCourse(userId: string) {
    setGenericConfirm({
      title: "Desvincular Alumno",
      description: "¿Estás seguro que querés desvincular a este alumno del curso?",
      action: async () => {
        try {
          await api.put(`/users/${userId}`, { cursoId: null });
          fetchCursoDetail(selectedCursoId!);
          setSuccessMessage("¡Alumno desvinculado correctamente!");
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
          console.error(err);
        }
      }
    });
  }

  // ---- SCHEDULE MANAGEMENT ----
  function openEditSchedule(a: any) {
    setEditingScheduleId(a.id);
    setFormError(null);
    setScheduleData({
      diaSemana: a.diaSemana,
      horaInicio: a.horaInicio,
      horaFin: a.horaFin,
      profesorId: a.profesorId || a.profesor?.id,
      materiaId: a.materiaId || a.materia?.id,
      aulaId: a.aulaId || a.aula?.id,
    });
    setOpenScheduleForm(true);
  }

  function openCreateSchedule() {
    setEditingScheduleId(null);
    setFormError(null);
    setScheduleData({
      diaSemana: "Lunes",
      horaInicio: "08:00",
      horaFin: "10:00",
      profesorId: profesores[0]?.id as string || "",
      materiaId: (materias[0]?.id as number) || 0,
      aulaId: (aulas[0]?.id as number) || 0,
    });
    setOpenScheduleForm(true);
  }

  async function saveSchedule() {
    if (!scheduleData.profesorId || !scheduleData.materiaId || !scheduleData.aulaId) return;
    
    // Validar tiempo
    const [h1, m1] = scheduleData.horaInicio.split(':').map(Number);
    const [h2, m2] = scheduleData.horaFin.split(':').map(Number);
    if ((h2 * 60 + m2) <= (h1 * 60 + m1)) {
      setFormError('La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    const payload = {
      ...scheduleData,
      cursoId: selectedCursoId
    };

    try {
      if (editingScheduleId) {
        await api.put(`/asignaciones/${editingScheduleId}`, payload);
      } else {
        await api.post("/asignaciones", payload);
      }
      setOpenScheduleForm(false);
      fetchCursoDetail(selectedCursoId!);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.data?.message) {
        setFormError(err.response.data.message);
      }
    }
  }

  async function deleteSchedule(id: number) {
    setGenericConfirm({
      title: "Eliminar Horario",
      description: "¿Estás seguro que querés eliminar este horario de la grilla?",
      action: async () => {
        try {
          await api.delete(`/asignaciones/${id}`);
          fetchCursoDetail(selectedCursoId!);
          setSuccessMessage("¡Horario eliminado correctamente!");
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
          console.error(err);
        }
      }
    });
  }

  // ---- RENDER ----
  if (selectedCursoId) {
    // VISTA DETALLE
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => { setSelectedCursoId(null); fetchCursos(); }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Gestionar Curso: {cursoDetail?.nombre || "Cargando..."}
              </h1>
              {cursoDetail && (
                <Button variant="ghost" size="icon" onClick={() => { setEditingCurso(cursoDetail); setNombreCurso(cursoDetail.nombre); setOpenForm(true); }}>
                  <Pencil className="h-4 w-4 text-slate-500" />
                </Button>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Administrá los integrantes y la grilla de horarios.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
            <CheckCircle className="h-5 w-5" />
            <span className="block sm:inline font-medium">{successMessage}</span>
          </div>
        )}

        {loadingDetail ? (
          <div className="flex justify-center py-12 text-slate-500">Cargando detalles...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* BLOQUE ALUMNOS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Alumnos ({cursoDetail?.estudiantes?.length || 0})
                </h3>
                <Button size="sm" onClick={loadAvailableStudents}>
                  <Plus className="h-4 w-4 mr-1" /> Agregar
                </Button>
              </div>
              <div className="rounded-md border dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cursoDetail?.estudiantes?.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-4">Sin alumnos.</TableCell></TableRow>
                    ) : (
                      cursoDetail?.estudiantes?.map(u => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.nombre || "Sin nombre"}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeStudentFromCourse(u.id)}>
                              Desvincular
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* BLOQUE HORARIOS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Horarios ({cursoDetail?.asignaciones?.length || 0})
                </h3>
                <Button size="sm" onClick={openCreateSchedule}>
                  <Plus className="h-4 w-4 mr-1" /> Nueva Clase
                </Button>
              </div>
              <div className="rounded-md border dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                      <TableHead>Día y Hora</TableHead>
                      <TableHead>Materia</TableHead>
                      <TableHead>Aula</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cursoDetail?.asignaciones?.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-4">Sin horarios asignados.</TableCell></TableRow>
                    ) : (
                      cursoDetail?.asignaciones?.map(a => (
                        <TableRow key={a.id}>
                          <TableCell>
                            <span className="font-semibold block text-sm">{a.diaSemana}</span>
                            <span className="text-xs text-slate-500">{a.horaInicio} - {a.horaFin}</span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {a.materia?.nombre} <br/>
                            <span className="text-xs text-slate-500">{a.profesor?.nombre || a.profesor?.email}</span>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {a.aula?.nombre}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openEditSchedule(a)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteSchedule(a.id)}><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL AGREGAR ALUMNO */}
        <Dialog open={openAddStudent} onOpenChange={setOpenAddStudent}>
          <DialogContent>
            <DialogHeader><DialogTitle>Vincular Alumno al Curso</DialogTitle></DialogHeader>
            <div className="py-4">
              <Label>Seleccionar Alumno (solo Estudiantes sin este curso)</Label>
              <div className="mt-2">
                <SearchableSelect 
                  options={availableStudents.map(u => ({ 
                    id: u.id, 
                    nombre: `${u.nombre || u.email} (${u.curso ? u.curso.nombre : 'Sin curso asignado'})`
                  }))} 
                  value={selectedStudentToAdd} 
                  onChange={(val) => setSelectedStudentToAdd(val)} 
                  placeholder="Buscar estudiante..." 
                />
              </div>
              
              {(() => {
                const selected = availableStudents.find(u => u.id === selectedStudentToAdd);
                if (selected && selected.curso) {
                  return (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800 flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <strong>Atención:</strong> Este alumno ya pertenece al curso <strong>{selected.curso.nombre}</strong>. Si lo vinculas a este curso, será transferido automáticamente y dejará de pertenecer al anterior.
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAddStudent(false)}>Cancelar</Button>
              <Button onClick={addStudentToCourse} disabled={availableStudents.length === 0}>Vincular</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL EDITAR HORARIO */}
        <Dialog open={openScheduleForm} onOpenChange={setOpenScheduleForm}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editingScheduleId ? "Editar Horario" : "Nuevo Horario"}</DialogTitle></DialogHeader>
            {formError && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm">
                <AlertCircle className="h-4 w-4" /> {formError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Label>Día</Label>
                <SearchableSelect 
                  options={dias.map(d => ({ id: d, nombre: d }))}
                  value={scheduleData.diaSemana}
                  onChange={val => setScheduleData({...scheduleData, diaSemana: val})}
                  placeholder="Seleccionar día..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Inicio</Label><Input type="time" value={scheduleData.horaInicio} onChange={e => {setScheduleData({...scheduleData, horaInicio: e.target.value}); setFormError(null)}}/></div>
                <div><Label>Fin</Label><Input type="time" value={scheduleData.horaFin} onChange={e => {setScheduleData({...scheduleData, horaFin: e.target.value}); setFormError(null)}}/></div>
              </div>
              <div>
                <Label>Profesor</Label>
                <SearchableSelect
                  options={profesores}
                  value={scheduleData.profesorId}
                  onChange={val => setScheduleData({...scheduleData, profesorId: val})}
                  placeholder="Buscar profesor..."
                />
              </div>
              <div>
                <Label>Materia</Label>
                <SearchableSelect
                  options={materias}
                  value={scheduleData.materiaId}
                  onChange={val => setScheduleData({...scheduleData, materiaId: +val})}
                  placeholder="Buscar materia..."
                />
              </div>
              <div>
                <Label>Aula</Label>
                <SearchableSelect
                  options={aulas}
                  value={scheduleData.aulaId}
                  onChange={val => setScheduleData({...scheduleData, aulaId: +val})}
                  placeholder="Buscar aula..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenScheduleForm(false)}>Cancelar</Button>
              <Button onClick={saveSchedule}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL CREAR/EDITAR CURSO */}
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingCurso ? "Editar Curso" : "Nuevo Curso"}</DialogTitle></DialogHeader>
            <div className="py-4">
              <Label>Nombre del Curso</Label>
              <Input 
                value={nombreCurso} 
                onChange={(e) => setNombreCurso(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && saveCurso()}
                placeholder="Ej: 6to Info" 
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenForm(false)}>Cancelar</Button>
              <Button onClick={saveCurso} disabled={!nombreCurso}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL CONFIRMACION GENERICA */}
        <Dialog open={!!genericConfirm} onOpenChange={(open) => !open && setGenericConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{genericConfirm?.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-slate-600 dark:text-slate-400">
              {genericConfirm?.description}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGenericConfirm(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => {
                if (genericConfirm) {
                  genericConfirm.action();
                  setGenericConfirm(null);
                }
              }}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // VISTA LISTA PRINCIPAL
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Cursos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Administra los cursos, sus alumnos y su grilla de clases.</p>
        </div>
        <Button onClick={() => { setEditingCurso(null); setNombreCurso(""); setOpenForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Curso
        </Button>
      </div>

      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
          <CheckCircle className="h-5 w-5" />
          <span className="block sm:inline font-medium">{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">Cargando...</div>
      ) : (
        <div className="rounded-md border dark:border-slate-700 bg-white dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead>Nombre del Curso</TableHead>
                <TableHead className="text-center">Alumnos</TableHead>
                <TableHead className="text-center">Materias</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursos.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">No hay cursos.</TableCell></TableRow>
              ) : (
                cursos.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold">{c.nombre}</TableCell>
                    <TableCell className="text-center text-slate-500">{c.estudiantes?.length || 0}</TableCell>
                    <TableCell className="text-center text-slate-500">{new Set(c.asignaciones?.map(a => a.materiaId) || []).size}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedCursoId(c.id)}>
                          <Settings className="h-4 w-4 mr-2" /> Gestionar
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setConfirmAction({ type: 'delete', cursoId: c.id, nombre: c.nombre })}>
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

      {/* PAPELERA DE RECICLAJE */}
      {!loading && deletedCursos.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Trash2 className="h-5 w-5 text-red-500" /> Papelera de Reciclaje
          </h2>
          <div className="rounded-md border dark:border-slate-700 bg-red-50/50 dark:bg-red-950/20">
            <Table>
              <TableHeader>
                <TableRow className="bg-red-100/50 dark:bg-red-900/20">
                  <TableHead>Nombre del Curso</TableHead>
                  <TableHead className="text-center">Alumnos</TableHead>
                  <TableHead className="text-center">Materias</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedCursos.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold text-slate-500 line-through">{c.nombre}</TableCell>
                    <TableCell className="text-center text-slate-400">{c.estudiantes?.length || 0}</TableCell>
                    <TableCell className="text-center text-slate-400">{new Set(c.asignaciones?.map(a => a.materiaId) || []).size}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setConfirmAction({ type: 'restore', cursoId: c.id, nombre: c.nombre })}>
                          Restaurar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setConfirmAction({ type: 'hardDelete', cursoId: c.id, nombre: c.nombre })}>
                          Borrar
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

      {/* MODAL DE CONFIRMACIÓN */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {confirmAction?.type === 'delete' && '¿Mover a papelera?'}
              {confirmAction?.type === 'restore' && '¿Restaurar curso?'}
              {confirmAction?.type === 'hardDelete' && '¡Peligro! ¿Borrado definitivo?'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {confirmAction?.type === 'delete' && (
              <p>Estás a punto de eliminar el curso <strong>{confirmAction?.nombre}</strong>. Pasará a la papelera y sus alumnos quedarán desvinculados del mismo hasta que sea restaurado.</p>
            )}
            {confirmAction?.type === 'restore' && (
              <p>El curso <strong>{confirmAction?.nombre}</strong> volverá a estar activo y visible para los usuarios.</p>
            )}
            {confirmAction?.type === 'hardDelete' && (
              <p>Estás a punto de borrar <strong>{confirmAction?.nombre}</strong> para siempre. <strong>Esta acción no se puede deshacer.</strong></p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancelar</Button>
            <Button 
              variant={confirmAction?.type === 'hardDelete' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
            >
              {confirmAction?.type === 'restore' ? 'Restaurar' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL CREAR/EDITAR CURSO */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCurso ? "Editar Curso" : "Nuevo Curso"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Nombre del Curso</Label>
            <Input 
                value={nombreCurso} 
                onChange={(e) => setNombreCurso(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && saveCurso()}
                placeholder="Ej: 6to Info" 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)}>Cancelar</Button>
            <Button onClick={saveCurso} disabled={!nombreCurso}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL CONFIRMACION GENERICA */}
      <Dialog open={!!genericConfirm} onOpenChange={(open) => !open && setGenericConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{genericConfirm?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-600 dark:text-slate-400">
            {genericConfirm?.description}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenericConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => {
              if (genericConfirm) {
                genericConfirm.action();
                setGenericConfirm(null);
              }
            }}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
