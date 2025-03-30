"use server";

import { get } from "@/common/util/fetch";

export interface EstadoProyectos {
    calificados: number;
    noCalificados: number;
}



export default async function getEstadoProyecto() {
    const response = await get<EstadoProyectos>("reportes/estado-evaluaciones");
    if (response.error) {
        return [];
    }

    return response.data;
}