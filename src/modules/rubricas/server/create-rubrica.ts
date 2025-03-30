"use server";

import { post } from "@/common/util/fetch";
import { Rubrica } from "../rubrica-types";

export default async function createRubrica(data: Rubrica) {

    const { error, data: newRubrica } = await post("rubricas", data);

    if (error) {
        return { error };
    }

    return newRubrica;
}