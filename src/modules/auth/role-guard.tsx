"use client";

import { useAuthStore } from "@/modules/auth/auth-store";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
    readonly allowedRoles: string[];
    readonly children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    const { user, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            console.log(allowedRoles);
            console.log(user);
            if (!user?.roles.some((role: string) => allowedRoles.includes(role))) {
                router.replace("/");
            }
        }
    }, [user, loading, allowedRoles]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
}