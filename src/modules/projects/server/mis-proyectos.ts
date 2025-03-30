"use server";

import { get } from "@/common/util/fetch";
import { Project } from "../project-type";

export default async function getMyProjects() {
    const response = await get<Project[]>("proyectos/mis-proyectos", ["projects"]);
    if (response.error) {
        return [];
    }

    return response.data;
}