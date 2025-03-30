"use server";

import { get } from "@/common/util/fetch";
import { Convocatoria } from '../convocatoria-types';

export default async function getConvocatoriaById(id: string) {
    const response = await get<Convocatoria>(`convocatorias/${id}`);
    if (response.error) {
        return null;
    }

    return response.data;
}