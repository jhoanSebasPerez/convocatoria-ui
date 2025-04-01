"use server";

import { get } from "@/common/util/fetch";

export default async function searchItems(query: string) {
    const response = await get(`search?q=${query}`);

    if (response.error) {
        return [];
    }
    return response.data;
}