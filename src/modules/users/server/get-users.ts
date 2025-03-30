"use server";

import { get } from "@/common/util/fetch";
import { User } from "../users-types";

export default async function getUsers() {
    const response = await get<User[]>("users", ["users"]);
    if (response.error) {
        return [];
    }

    return response.data;
}