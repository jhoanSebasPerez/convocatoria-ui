"use server";

import { get } from "@/common/util/fetch";

export interface ProyectoCalificado {
    id: string;
    titulo: string;
    convocatoria: string;
    puntajeFinal: number;
    fechaEvaluacion: string;
}

export default async function getProjectsCalificados() {
    const response = await get<ProyectoCalificado[]>("proyectos/calificados", ["projects"]);
    if (response.error) {
        return [];
    }

    return response.data;
}