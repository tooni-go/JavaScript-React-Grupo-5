import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/auth/login", "/auth/register"].includes(nextUrl.pathname)

  if (isApiAuthRoute) return undefined

  if (isPublicRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    return undefined
  }

  // Redirigir la raíz al dashboard si está logueado
  if (nextUrl.pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  // Protección de rutas de Admin con Ofuscación (404)
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  if (isAdminRoute) {
    const userRole = (req.auth?.user as any)?.rol;
    if (userRole !== "SUPERADMIN") {
      // Reescribir a una ruta inexistente para forzar la página 404 de Next.js
      return NextResponse.rewrite(new URL("/404", nextUrl));
    }
  }

  return undefined
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
