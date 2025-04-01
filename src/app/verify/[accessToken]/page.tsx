"use client";

import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Button } from "@mui/material";
import verifyToken from "@/modules/auth/server/verify-token";
import { useRouter } from "next/navigation";

type VerificacionExitosoProps = {
    readonly params: { accessToken: string };
};

export default function VerificacionExito({ params }: VerificacionExitosoProps) {
    const { accessToken } = params;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        setLoading(true);
        verifyToken({ accessToken })
            .then((response) => {
                if (response?.error) {
                    setSuccess(false); // Si hay error, mostrar mensaje de error
                } else {
                    setSuccess(true); // Si la respuesta es exitosa, mostrar mensaje de éxito
                }
            })
            .catch(() => {
                setSuccess(false); // Si ocurre un error al hacer la petición, mostrar error
            })
            .finally(() => {
                setLoading(false); // Dejar de cargar cuando termine la operación
            });

    }, [accessToken]);

    const handleRedirect = () => {
        router.push("/auth/login"); // Redirigir manualmente al login
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
                padding: 2,
            }}
        >
            {loading && (
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Verificando token...
                    </Typography>
                </Box>
            )}

            {!loading && success && (
                <Box sx={{ textAlign: "center", maxWidth: 400 }}>
                    <Alert severity="success">
                        ✅ Token verificado con éxito.
                    </Alert>
                    <Button
                        variant="contained"
                        sx={{ marginTop: 2 }}
                        onClick={handleRedirect}
                    >
                        Ir al Login
                    </Button>
                </Box>
            )}

            {!loading && success === false && (
                <Box sx={{ textAlign: "center", maxWidth: 400 }}>
                    <Alert severity="error">
                        ❌ Error: Token inválido.
                    </Alert>
                    <Button
                        variant="contained"
                        sx={{ marginTop: 2 }}
                        onClick={handleRedirect}
                    >
                        Ir al Login
                    </Button>
                </Box>
            )}
        </Box>
    );
}