"use server";

import { get } from "@/common/util/fetch";
import { Convocatoria } from '../convocatoria-types';

export default async function getConvocatoriasAvailables() {
    const response = await get<Convocatoria[]>("convocatorias/availables", ["convocatorias"]);
    if (response.error) {
        return [];
    }
    return response.data;
}