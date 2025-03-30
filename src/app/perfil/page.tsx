"use client";

import { useState } from "react";
import { useAuthStore } from "@/modules/auth/auth-store";
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";

export default function PerfilPage() {
    const { user, loading, updateProfile, changePassword } = useAuthStore();

    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [fullname, setFullname] = useState(user?.fullname || "");
    const [email, setEmail] = useState(user?.email || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6, height: "100%" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6">No hay usuario autenticado</Typography>
            </Box>
        );
    }

    const handleSave = () => {
        updateProfile({ fullname, email });
        setIsEditing(false);
    };

    const handleChangePassword = () => {
        if (newPassword === confirmPassword) {
            changePassword({ newPassword, confirmPassword });
            setNewPassword("");
            setShowPasswordForm(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "background.paper",
            }}
        >
            {/* Avatar y Nombre */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                    alt={fullname || "Usuario"}
                    src="/static/images/avatar/default.jpg"
                    sx={{ width: 64, height: 64 }}
                />
                <Box sx={{ flex: 1 }}>
                    {isEditing ? (
                        <>
                            <TextField
                                fullWidth
                                label="Nombre Completo"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {fullname || "Nombre no disponible"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {email}
                            </Typography>
                        </>
                    )}
                </Box>
                <IconButton onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <SaveIcon color="success" /> : <EditIcon />}
                </IconButton>
            </Stack>

            {isEditing && (
                <Button variant="contained" onClick={handleSave} fullWidth sx={{ mt: 2 }}>
                    Guardar Cambios
                </Button>
            )}

            {/* Roles */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Roles:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                    {user.roles.map((role, index) => (
                        <Chip key={index} label={role} color="primary" />
                    ))}
                </Stack>
            </Box>

            {/* Botón para mostrar el formulario de cambio de contraseña */}
            <Box sx={{ mt: 3 }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    disabled={showPasswordForm || loading}
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                    {showPasswordForm ? "Cancelar" : "¿Desea cambiar la contraseña?"}
                </Button>
            </Box>

            {/* Formulario de cambio de contraseña (solo si el usuario lo activó) */}
            {showPasswordForm && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        Nueva Contraseña:
                    </Typography>
                    <TextField
                        fullWidth
                        label="Nueva Contraseña"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Confirmar Contraseña"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LockIcon />}
                        onClick={handleChangePassword}
                        disabled={!newPassword || !confirmPassword || loading}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Cambiar Contraseña
                    </Button>
                </Box>
            )}
        </Box>
    );
}