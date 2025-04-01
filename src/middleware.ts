import authenticated from "@/modules/auth/server/authenticated";
import { NextRequest } from "next/server";

const unathorizedRoutes = [
    "/auth/login",
    "/auth/signup",
    "/activar-cuenta",
    "/registro-exitoso",
    "/verify",
];

export async function middleware(request: NextRequest) {

    const auth = await authenticated();

    const isUnauthorizedRoute = unathorizedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (!auth && !isUnauthorizedRoute) {
        return Response.redirect(new URL("/auth/login", request.url));
    }

    if (auth && isUnauthorizedRoute) {
        return Response.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};