"use server";

import { post } from "@/common/util/fetch";

export default async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await post("upload", formData);

    if (response.error) {
        return { error: response.error };
    }

    return response.data;
}