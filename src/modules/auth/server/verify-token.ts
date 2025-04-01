"use server";

import { post } from "@/common/util/fetch";

export default async function verifyToken(data: { accessToken: string }) {
    const response = await post("auth/verify-token", data);

    if (response.error) {
        return { error: response.error };
    }

    return response.data;

}