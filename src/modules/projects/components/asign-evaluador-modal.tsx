"use client";

import React, { useEffect, useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Modal,
    Box,
    Typography,
} from "@mui/material";
import getDocentes from "@/modules/users/server/get-docentes";
import asignarDocenteAProyecto from "../server/asignar-docente";

interface AsignarEvaluadorModalProps {
    proyectoId: string;
    open: boolean;
    onClose: () => void;
}

const AsignarEvaluadorModal: React.FC<AsignarEvaluadorModalProps> = ({ proyectoId, open, onClose }) => {

    const [docentes, setDocentes] = useState<any[]>([]);
    const [evaluadorId, setEvaluadorId] = useState("");
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState("");

    // 📌 Cargar la lista de docentes al abrir el modal
    useEffect(() => {
        if (open) {
            getDocentes().then((data: any) => setDocentes(data));
        }
    }, [open]);

    // 📌 Manejar la asignación del evaluador
    const handleAsignar = async () => {
        if (!evaluadorId) return;

        setLoading(true);
        try {
            const response = await asignarDocenteAProyecto(proyectoId, evaluadorId);
            if (!response.error) {
                setOpenSnackbar(true);
                onClose();
                window.location.reload();
            } else {
                setError(response.error);
            }
        } catch (error) {
            console.error("Error al asignar evaluador:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 📌 MODAL */}
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    {error && <Alert severity="error">{error}</Alert>}
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Asignar Evaluador
                    </Typography>

                    {/* 📌 Dropdown de Docentes */}
                    <FormControl fullWidth>
                        <InputLabel>Seleccionar Evaluador</InputLabel>
                        <Select
                            value={evaluadorId}
                            onChange={(e) => setEvaluadorId(e.target.value)}
                        >
                            {docentes.map((docente) => (
                                <MenuItem key={docente.id} value={docente.id}>
                                    {docente.fullname} ({docente.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 📌 Botón para asignar */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAsignar}
                        disabled={loading || !evaluadorId}
                        sx={{ mt: 2 }}
                        fullWidth
                    >
                        {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : "Asignar Evaluador"}
                    </Button>

                    {/* 📌 Botón para cerrar */}
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                        sx={{ mt: 1 }}
                        fullWidth
                    >
                        Cancelar
                    </Button>
                </Box>
            </Modal>

            {/* 📌 Notificación de éxito */}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert severity="success">Evaluador asignado con éxito</Alert>
            </Snackbar>
        </>
    );
};

export default AsignarEvaluadorModal;