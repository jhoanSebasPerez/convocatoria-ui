"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, CircularProgress, Alert } from "@mui/material";
import activarCuenta from "@/modules/auth/server/activar-cuenta";


type ActivarCuentaProps = {
    readonly params: Promise<{ accessToken: string }>;
}


export default function ActivarCuenta({ params }: ActivarCuentaProps) {
    const router = useRouter();
    const { accessToken } = use(params);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (!accessToken) {
            setError("Token no válido.");
        }
    }, [accessToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setLoading(false);
            return;
        }

        try {
            const response = await activarCuenta({ accessToken: accessToken, password });

            if (response.error) throw new Error(response.error || "Error activando cuenta.");

            setSuccess(true);
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", mt: 5, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Activar Cuenta</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success ? (
                <Alert severity="success">Cuenta activada con éxito. Redirigiendo...</Alert>
            ) : (
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        placeholder="Nueva Contraseña"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        placeholder="Confirmar Contraseña"
                        type="password"
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Activar Cuenta"}
                    </Button>
                </form>
            )}
        </Box>
    );
}