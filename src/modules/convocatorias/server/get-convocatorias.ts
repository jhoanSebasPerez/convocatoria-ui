"use server";

import { get } from "@/common/util/fetch";
import { Convocatoria } from '../convocatoria-types';

export default async function getConvocatorias() {
    const response = await get<Convocatoria[]>("convocatorias", ["convocatorias"]);
    if (response.error) {
        return [];
    }

    return response.data;
}