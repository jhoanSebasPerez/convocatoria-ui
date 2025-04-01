"use client";

import { Container, Typography, Button, Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
    const router = useRouter();

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80 }} />
            <Typography variant="h4" gutterBottom>
                ¡Registro exitoso!
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Hemos enviado un correo de confirmación a tu dirección de email. Por
                favor revisa tu bandeja de entrada y sigue las instrucciones para
                activar tu cuenta.
            </Typography>
            <Box mt={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push("/")}
                >
                    Volver al inicio
                </Button>
            </Box>
        </Container>
    );
}
