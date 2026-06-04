"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { getApiBase } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});

// Separate component that uses useSearchParams
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    setError(null);
    setDebugInfo(null);

    const apiUrl = `${getApiBase()}/auth/login`;
    console.log("[Login] Attempting to:", apiUrl);
    console.log("[Login] Email:", values.email);

    try {
      const response = await axios.post(apiUrl, {
        email: values.email,
        password: values.password,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("[Login] Success! Response:", {
        user_id: response.data.user_id,
        rol: response.data.rol,
        hasAccessToken: !!response.data.access_token
      });

      if (response.data?.access_token) {
        const userRol = response.data.rol ?? null;
        
        login({
          id: response.data.user_id,
          email: values.email,
          rol: userRol,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        });
        
        if (userRol === null || userRol === undefined || userRol === "" || userRol === "PENDING") {
          console.log("[Login] User has no role, redirecting to /pendiente");
          router.push("/pendiente");
        } else {
          console.log("[Login] User has role:", userRol, "-> /dashboard");
          router.push("/dashboard");
        }
        return;
      }
      
      setError("Respuesta inválida del servidor");
    } catch (err: any) {
      console.error("[Login] Error:", err);
      
      let errorMsg = "Error al iniciar sesión";
      
      if (err.code === "ERR_NETWORK") {
        errorMsg = "No se puede conectar al servidor. Verifica que el backend esté corriendo en " + getApiBase();
      } else if (err.response?.status === 401) {
        errorMsg = "Email o contraseña incorrectos";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = `Error: ${err.message}`;
      }
      
      setError(errorMsg);
      setDebugInfo(`URL: ${apiUrl} | Status: ${err.response?.status || 'Network Error'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder al mapa.
        </CardDescription>
        {justRegistered && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
            ✅ Registro exitoso. Ahora podés iniciar sesión.
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ejemplo@escuela.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
                <p className="font-medium">{error}</p>
                {debugInfo && (
                  <p className="text-xs mt-1 text-red-600 font-mono">{debugInfo}</p>
                )}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cargando..." : "Ingresar"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-slate-500">
          ¿No tenés cuenta?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Registrate aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

// Main export with Suspense
export function LoginForm() {
  return (
    <Suspense fallback={
      <Card className="border-none shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
