"use server"

import { post } from "@/common/util/fetch";
import { Project } from "../project-type";
import { redirect } from "next/navigation";

export default async function createProject(proyect: Project) {
    const response = await post<Project>("proyectos", proyect);

    if (response.error) {
        return { error: response.error };
    }

    redirect(`/mis-proyectos/${response.data.id}`);
}