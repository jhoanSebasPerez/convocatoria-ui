"use server";

import { get } from "@/common/util/fetch";
import { User } from "@/modules/users/users-types";

export default async function fetchProfile() {
    const response = await get<User>("users/me");
    if (response.error) {
        return null;
    }

    return response.data;
}