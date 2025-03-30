"use server";

import { get } from "@/common/util/fetch";
import { Evaluacion } from "@/modules/evaluaciones/evaluacion-type";




export default async function getEvaluacionPorProyecto(id: string) {
    const response = await get<Evaluacion>(`evaluaciones/proyectos/${id}`);

    if (response.error) {
        return null;
    }

    return response.data;
}