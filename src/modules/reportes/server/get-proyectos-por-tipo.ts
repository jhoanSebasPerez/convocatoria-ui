"use server";

import { get } from "@/common/util/fetch";

export default async function getProyectosPorTipo() {
    const response = await get("reportes/proyectos-tipo");
    if (response.error) {
        return [];
    }

    return response.data;
}