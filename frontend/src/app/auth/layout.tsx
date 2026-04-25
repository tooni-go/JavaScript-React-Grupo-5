export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Escuela Interactiva
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sistema de Gestión de Mapas y Aulas
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
