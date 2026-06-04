"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getApiBase } from "@/lib/api";

const registerSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "Mínimo 6 caracteres" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    setError(null);
    setDebugInfo(null);

    const apiUrl = `${getApiBase()}/auth/register`;
    console.log("[Register] Attempting to:", apiUrl);
    console.log("[Register] Email:", values.email);

    try {
      const response = await axios.post(apiUrl, {
        email: values.email,
        password: values.password,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("[Register] Success! Response:", response.data);

      router.push("/auth/login?registered=true");
    } catch (err: any) {
      console.error("[Register] Error:", err);
      
      let errorMsg = "Error al registrarse";
      
      if (err.code === "ERR_NETWORK") {
        errorMsg = "No se puede conectar al servidor. Verifica que el backend esté corriendo.";
      } else if (err.response?.status === 401) {
        errorMsg = "El usuario ya existe";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = `Error: ${err.message}`;
      }
      
      setError(errorMsg);
      setDebugInfo(`URL: ${apiUrl} | Status: ${err.response?.status || 'Network Error'}`);
      setLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>
          Únete a la plataforma para gestionar tus clases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input placeholder="estudiante@escuela.com" {...field} />
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
                  <Label>Contraseña</Label>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label>Confirmar Contraseña</Label>
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
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-slate-500">
          ¿Ya tenés cuenta?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
