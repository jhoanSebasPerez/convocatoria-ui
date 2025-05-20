// app/actions/logout.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logout() {
    // 1. Construir cabecera Cookie a partir de next/headers
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");

    // 2. Llamar al back incluyendo la cookie
    const res = await fetch(`${process.env.API_URL}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Forward de la cookie de sesión
            Cookie: cookieHeader,
        },
        // por si tu API requiere JSON
        body: JSON.stringify({}),
        // asegúrate de no cachear
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Logout fallido");
    }

    // 3. Borrar cookie en el cliente (la del navegador)
    // Asegurarse de que cookieStore está disponible antes de usarlo
    (await cookies()).delete("Authentication");

    // 4. Redirigir al login
    redirect("/auth/login");
}