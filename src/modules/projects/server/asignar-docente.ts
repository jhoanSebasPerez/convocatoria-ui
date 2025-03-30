"use server";

import { post } from "@/common/util/fetch";

export default async function asignarDocenteAProyecto(
    proyectoId: string, docenteId: string
) {
    const response = await post(`proyectos/${proyectoId}/asignar-evaluador/${docenteId}`, {});
    if (response.error) {
        return [];
    }

    return response.data;
}