"use server";

import { get } from "@/common/util/fetch";

export interface ProyectoPorConvocatoria {
    titulo: string,
    _count: {
        proyectos: number
    }
}



export default async function getProyectosPorConvocatoria() {
    const response = await get<ProyectoPorConvocatoria[]>("reportes/proyectos-por-convocatoria");
    if (response.error) {
        return [];
    }

    return response.data;
}