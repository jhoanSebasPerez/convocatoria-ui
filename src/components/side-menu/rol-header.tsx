"use client";

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuthStore } from '@/modules/auth/auth-store';

interface Roles {
    [key: string]: string;
}

const roles: Roles = {
    "ADMIN": "Administrador",
    "ESTUDIANTE": "Estudiante",
    "DOCENTE": "Docente",
};

export default function RolHeader() {
    const { user, loading } = useAuthStore();

    if (loading || !user?.roles?.length) return null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '8px' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: "bold", fontSize: "1rem" }}>
                {roles[user.roles[0]] || "Sin Rol"}
            </Typography>
        </Box>
    );
}