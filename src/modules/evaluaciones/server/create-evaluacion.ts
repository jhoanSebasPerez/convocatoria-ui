"use server"

import { post } from "@/common/util/fetch";
import { Evaluacion } from "../evaluacion-type";
import { redirect } from "next/navigation";

export default async function createEvaluacion(evaluacion: Evaluacion) {
    const response = await post<Evaluacion>("evaluaciones", evaluacion);

    if (response.error) {
        return { error: response.error };
    }

    redirect(`/proyectos-calificados`);
}