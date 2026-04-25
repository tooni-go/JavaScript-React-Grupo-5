import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-100 p-4">
            <h3 className="font-semibold">Información de Sesión</h3>
            <pre className="mt-2 overflow-auto text-xs">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant="destructive">Cerrar Sesión</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
