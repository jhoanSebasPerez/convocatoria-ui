"use server";

import { uploadFile } from "@/common/util/fetch";


export default async function uploadFileServer(file: File) {

    const response = await uploadFile(file);

    if (response.error) {
        return { error: response.error };
    }

    return response.data;
}