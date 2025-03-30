"use server";

import { post } from "@/common/util/fetch"
import { revalidateTag } from "next/cache";
import { Convocatoria } from '../convocatoria-types';

export default async function createConvocatoria(convocatoria: Convocatoria) {
    const response = await post("convocatorias", convocatoria);
    revalidateTag("convocatorias");
    return response;
}