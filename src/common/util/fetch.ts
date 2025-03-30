"use server"

import { API_URL } from "../constants/api";
import { ResponseType } from "../interfaces/response-type";
import { getErrorMessage } from "./error";
import { cookies } from "next/headers";


const getHeaders = async () => {
    const cookieStore = await cookies(); // 🔹 Obtener todas las cookies
    const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; "); // 🔹 Formatear correctamente

    return {
        Cookie: cookieHeader, // 🔹 Enviar cookies en el encabezado
        "Content-Type": "application/json",
        credentials: "include", // 🔹 Asegurar que las credenciales se incluyan
    };
};

export const post = async <T>(path: string, data: T) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/${path}`, {
        method: "POST",
        headers: { ...headers },
        body: JSON.stringify(data),
    });

    const parsedRes = await response.json();
    if (!response.ok) {
        return { error: getErrorMessage(parsedRes), data: null };
    }

    return { error: "", data: parsedRes };
}

export const get = async <T>(path: string, tags?: string[]): Promise<ResponseType<T>> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/${path}`, {
        method: "GET",
        headers: {
            ...headers,
        },
        next: { tags },
    });

    if (!response.ok) {
        return { data: null, error: getErrorMessage(await response.json()) };
    }
    const data = await response.json();
    return { data, error: "" };
}

export const put = async <T>(path: string, data: T) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/${path}`, {
        method: "PUT",
        headers: { ...headers },
        body: JSON.stringify(data),
    });

    const parsedRes = await response.json();
    if (!response.ok) {
        return { error: getErrorMessage(parsedRes), data: null };
    }

    return { error: "", data: parsedRes };
}