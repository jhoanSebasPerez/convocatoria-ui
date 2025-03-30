"use server";

import { get } from "@/common/util/fetch";
import { Criterio } from "../rubrica-types";

export default async function getCriterios(query: string) {
    const response = await get<Criterio[]>(`criterios?search=${query}`, ["criterios"]);
    if (response.error) {
        return [];
    }

    return response.data;
}