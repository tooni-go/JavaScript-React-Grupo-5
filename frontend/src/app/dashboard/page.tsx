import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido, {session?.user?.email}</CardTitle>
          <CardDescription>
            Este es tu panel de control protegido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-slate-50 p-8 text-center">
            <h3 className="text-lg font-medium text-slate-900">
              Has ingresado correctamente al sistema.
            </h3>
            <p className="mt-2 text-slate-500 mb-6">
              Pronto podrás visualizar aquí el mapa interactivo de las aulas y horarios.
            </p>
            
            {(session?.user as any)?.rol === "SUPERADMIN" && (
              <div className="mt-6">
                <Link href="/admin">
                  <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
                    Ir al Panel de Administración
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
