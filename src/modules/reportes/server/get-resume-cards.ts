"use server";

import { get } from "@/common/util/fetch";

export interface ResumeCardsType {
    usuarios: number;
    proyectos: number;
    convocatorias: number;
}



export default async function getResumeCards() {
    const response = await get<ResumeCardsType>("reportes/estadisticas-cantidad");
    if (response.error) {
        return [];
    }

    return response.data;
}