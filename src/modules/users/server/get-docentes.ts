"use server";

import { get } from "@/common/util/fetch";
import { User } from "../users-types";

export default async function getDocentes() {
    const response = await get<User[]>("users/docentes", ["docentes"]);
    if (response.error) {
        return [];
    }

    return response.data;
}