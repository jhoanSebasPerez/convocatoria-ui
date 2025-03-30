"use server";

import { post } from "@/common/util/fetch";

export default async function createDocente(data: { fullname: string, email: string }) {

    const response = await post("users/create-docente", data);

    if (response.error) {
        return { error: response.error };
    }

    return response.data;
}