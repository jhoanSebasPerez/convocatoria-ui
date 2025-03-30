"use server";

import { get } from "@/common/util/fetch";
import { Project } from "../project-type";

export default async function getProjectsPorCalificar() {
    const response = await get<Project[]>("proyectos/proyectos-por-calificar", ["projects"]);
    if (response.error) {
        return [];
    }

    return response.data;
}