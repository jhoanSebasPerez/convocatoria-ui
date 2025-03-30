"use server";

import { get } from "@/common/util/fetch";
import { Project } from "../project-type";


export default async function getProjetById(id: string) {
    const response = await get<Project>(`proyectos/${id}`);
    if (response.error) {
        return null;
    }

    return response.data;
}