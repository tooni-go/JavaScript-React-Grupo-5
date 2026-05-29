"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Definimos tu usuario de forma fija para que las imágenes apunten a /~uno/
  const basePath = "/~uno";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // NOTA: Acá Cursor conectará esto con tu AuthContext/Provider del backend.
      // Dejamos una simulación básica para que pruebes el funcionamiento local/remoto:
      if (email && password) {
        console.log("Intentando iniciar sesión con:", email);
        // Si todo sale bien, redirigiría a la pantalla principal del mapa:
        // router.push("/mapa");
      }
    } catch (err) {
      setError("Hubo un problema al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
        <div className="text-center">
          {/* Usamos <img> nativo con el prefijo correcto de tu carpeta de usuario */}
          <img
            className="mx-auto h-12 w-auto dark:invert"
            src={`${basePath}/next.svg`}
            alt="Logo Escuela"
          />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Escuela Interactiva
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sistema de Gestión de Mapas y Aulas
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="ejemplo@escuela.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="********"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-zinc-950 dark:bg-zinc-50 px-3 py-2 text-sm font-semibold text-white dark:text-zinc-950 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-4">
          ¿No tienes cuenta?{" "}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
}