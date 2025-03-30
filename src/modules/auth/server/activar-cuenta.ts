"use server";

import { post } from "@/common/util/fetch";

export default async function activarCuenta(data: { accessToken: string, password: string }) {
    const response = await post("users/activar-cuenta", data);

    if (response.error) {
        return { error: response.error };
    }

    return response.data;

}