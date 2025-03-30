"use server";

import { get } from "@/common/util/fetch";
import { Project } from "../project-type";

export default async function getProjects() {
    const response = await get<Project[]>("proyectos", ["projects"]);
    if (response.error) {
        return [];
    }

    return response.data;
}