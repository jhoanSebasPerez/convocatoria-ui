import { Box, Chip, Divider, Grid2, Paper, Typography } from "@mui/material";
import { User } from "../users-types";

interface UserDetailProps {
    readonly selectedUser: User | null;
}

export default function UserDetail({
    selectedUser,
}: UserDetailProps) {
    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Detalle del Usuario
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {selectedUser ? (
                <Box>
                    <Typography variant="body1" fontWeight="bold">
                        Nombre:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedUser.fullname}
                    </Typography>

                    <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
                        Correo Electrónico:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedUser.email}
                    </Typography>

                    <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
                        Rol:
                    </Typography>
                    <Chip
                        label={selectedUser.roles[0]}
                        color={
                            selectedUser.roles[0] === "ADMIN"
                                ? "primary"
                                : selectedUser.roles[0] === "ESTUDIANTE"
                                    ? "secondary"
                                    : "default"
                        }
                        size="small"
                    />
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    Selecciona un usuario para ver los detalles
                </Typography>
            )}
        </Paper>
    );
}