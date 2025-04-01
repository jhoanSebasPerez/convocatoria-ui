"use server";

import { API_URL } from "@/common/constants/api";
import { FormResponse } from "@/common/interfaces/form-response";
import { getErrorMessage } from "@/common/util/error";
import { redirect } from "next/navigation";

export default async function createUser(
    _prevState: FormResponse,
    formData: FormData
) {
    const bodyData = {
        fullname: formData.get("fullname"),
        email: formData.get("email"),
        password: formData.get("password"),
        roles: ["ESTUDIANTE"]
    }
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
    });

    const parsedRes = await response.json();
    if (!response.ok) {
        return { error: getErrorMessage(parsedRes) };
    }

    redirect("/registro-exitoso");
}