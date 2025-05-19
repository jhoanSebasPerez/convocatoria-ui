"use server";

import { post } from "@/common/util/fetch";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logout() {

    const response = await post("auth/logout", {});

    if (response.data.success) {
        const cookieStore = await cookies();
        cookieStore.delete("Authentication");

        redirect("/auth/login");
    }
}