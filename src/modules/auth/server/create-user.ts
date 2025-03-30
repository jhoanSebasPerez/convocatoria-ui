"use server";

import { FormResponse } from "@/common/interfaces/form-response";
import { post } from "@/common/util/fetch";
import { redirect } from "next/navigation";
import { RegisterRequest } from "../auth-types";

export default async function createUser(_prevState: FormResponse, data: RegisterRequest) {

    const { error } = await post("users", data);

    if (error) {
        return { error };
    }

    redirect("/")
}