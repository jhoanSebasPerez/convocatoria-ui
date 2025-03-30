import { cookies } from "next/headers";

export default async function authenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    return !!cookieStore.get("Authentication");
}