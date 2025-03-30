"use server";

import { get } from "@/common/util/fetch";
import { Rubrica } from "../rubrica-types";

export default async function getRubricas(query: string) {
    const response = await get<Rubrica[]>(`rubricas?search=${query}`, ["rubricas"]);
    if (response.error) {
        return [];
    }

    return response.data;
}