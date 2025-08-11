import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes qui nécessitent une authentification
const protectedRoutes = [
  "/simulate",
  "/clients",
  "/client-info",
  "/history",
  "/report",
  "/feedback",
  "/settings",
  "/admin",
  "/assistant",
]

// Routes réservées aux admins
const adminRoutes = ["/admin", "/debug"]

// Routes publiques (pas besoin d'authentification)
const publicRoutes = ["/auth/signin", "/auth/signup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorer les routes API et les fichiers statiques
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname === route) || pathname === "/"

  // Récupérer le token d'authentification depuis les cookies
  const authToken = request.cookies.get("auth-token")?.value

  // Si pas de token et route protégée, rediriger vers la connexion
  if (!authToken && isProtectedRoute) {
    const url = new URL("/auth/signin", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Si c'est une route publique et pas de token, laisser passer
  if (isPublicRoute && !authToken) {
    return NextResponse.next()
  }

  // Si token présent, on laisse passer (la vérification se fera côté client)
  // Dans un vrai environnement, on vérifierait le token ici
  if (authToken) {
    // Simuler la vérification du token
    try {
      // Dans un vrai cas, on vérifierait le token avec la base de données
      // Pour l'instant, on fait confiance au token présent

      // Vérifier les permissions admin si nécessaire
      if (isAdminRoute) {
        // Dans un vrai cas, on vérifierait le rôle depuis le token
        // Pour l'instant, on laisse passer
      }

      return NextResponse.next()
    } catch (error) {
      console.error("Erreur middleware auth:", error)
      const response = NextResponse.redirect(new URL("/auth/signin", request.url))
      response.cookies.delete("auth-token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
