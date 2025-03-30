"use server";

import { put } from "@/common/util/fetch";

export async function updateProfile(data: { email: string, fullname: string }) {
    const response = await put(`users/update`, data);
    if (response.error) {
        return [];
    }

    return response.data;
}

export async function changePassword(data: { newPassword: string, confirmPassword: string }) {
    const response = await put(`users/change-password`, data);
    if (response.error) {
        return [];
    }

    return response.data;
}