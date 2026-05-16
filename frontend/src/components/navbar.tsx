import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          Escuela Interactiva
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-slate-600 hidden md:inline">
                {session.user?.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  // Intentamos cerrar sesión en el backend si tenemos el token
                  const currentSession = await auth();
                  const token = currentSession?.user as any;
                  if (token?.accessToken) {
                    try {
                      await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
                        {},
                        {
                          headers: { Authorization: `Bearer ${token.accessToken}` },
                        }
                      );
                    } catch (error) {
                      console.error("Error al cerrar sesión en el backend", error);
                    }
                  }
                  
                  // Siempre cerramos la sesión en el frontend
                  await signOut({ redirectTo: "/auth/login" });
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  Cerrar Sesión
                </Button>
              </form>
            </>
          ) : (
            <Link href="/auth/login">
              <Button size="sm">Iniciar Sesión</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
