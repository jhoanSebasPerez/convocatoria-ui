"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

export default function MiPagina() {
    const router = useRouter();

    useEffect(() => {
        router.push("/");
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
            <CircularProgress />
        </Box>
    )
}