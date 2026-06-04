"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { getApiBase } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";

export function LoginFormClient() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = `${getApiBase()}/auth/login`;

    try {
      const response = await axios.post(
        apiUrl,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.access_token) {
        const userRol = response.data.rol ?? null;
        
        login({
          id: response.data.user_id,
          email: email,
          rol: userRol,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        });
        
        if (!userRol || userRol === "" || userRol === "PENDING") {
          router.push("/pendiente");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("[Login] Error:", err);
      
      if (err.code === "ERR_NETWORK") {
        setError("No se puede conectar al servidor");
      } else if (err.response?.status === 401) {
        setError("Email o contraseña incorrectos");
      } else {
        setError("Error al iniciar sesión");
      }
      setLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-lg rounded-2xl w-full max-w-md">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresá tus credenciales para acceder al mapa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@escuela.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-slate-500 text-center w-full">
          ¿No tenés cuenta?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Registrate aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
