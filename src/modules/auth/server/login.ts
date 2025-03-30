"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FormResponse } from "../../../common/interfaces/form-response";
import { API_URL } from "../../../common/constants/api";
import { getErrorMessage } from "../../../common/util/error";
import { redirect } from "next/navigation";
import ms, { StringValue } from 'ms';

export default async function login(
    _prevState: FormResponse,
    formData: FormData
) {
    const bodyData = {
        email: formData.get("email"),
        password: formData.get("password"),
    }
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
    });

    const parsedRes = await response.json();
    if (!response.ok) {
        return { error: getErrorMessage(parsedRes) };
    }
    await setAuthCookie(response);
    redirect("/");
}

const setAuthCookie = async (response: Response) => {
    const setCookieHeader = response.headers.get("Set-Cookie");
    const storedCookies = await cookies();
    if (setCookieHeader) {
        const token = setCookieHeader.split(";")[0].split("=")[1];

        const expires = new Date();
        expires.setMilliseconds(
            expires.getMilliseconds() + ms(process.env.JWT_EXPIRATION as StringValue)
        );

        storedCookies.set({
            name: "Authentication",
            value: token,
            secure: true,
            httpOnly: true,
            expires: new Date(jwtDecode(token).exp! * 1000),
        });
    }
};