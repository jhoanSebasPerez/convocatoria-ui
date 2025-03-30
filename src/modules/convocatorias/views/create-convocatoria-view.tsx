"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Paper,
    Typography,
    FormControl,
    FormLabel,
    TextField,
    Button,
    Snackbar,
    Alert,
    Box,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import dayjs, { Dayjs } from "dayjs";
import { FormResponse } from "@/common/interfaces/form-response";
import CustomDatePicker from "@/components/date-picker";
import { Convocatoria } from "../convocatoria-types";
import AnimatedButton from "@/components/animated-button";
import { useConvocatoriaStore } from "../convocatoria-store";
import getConvocatorias from "../server/get-convocatorias";
import RubricaDropdown from "@/modules/rubricas/components/rubrica-dropdown";
import { useRubricaStore } from "@/modules/rubricas/rubrica-store";

interface CrearConvocatoriaPageProps {
    readonly sx: any;
    readonly setShowCreateRubrica: (show: boolean) => void;
}

export default function CrearConvocatoriaPage({
    sx,
    setShowCreateRubrica
}: CrearConvocatoriaPageProps) {
    const router = useRouter();
    const { addNewConvocatoria } = useConvocatoriaStore();
    const { clearSelectedRubrica, selectedRubrica } = useRubricaStore();


    const [response, setResponse] = useState<FormResponse>();
    const [fechaInicio, setFechaInicio] = useState<Dayjs>(dayjs());
    const [fechaFin, setFechaFin] = useState<Dayjs>(dayjs());
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const convocatoria: Convocatoria = {
            titulo: formData.get("titulo") as string,
            descripcion: formData.get("descripcion") as string,
            fechaInicio: dayjs(fechaInicio).toISOString(),
            fechaFin: dayjs(fechaFin).toISOString(),
            rubricaId: selectedRubrica?.id
        };

        setLoading(true);
        const response = await addNewConvocatoria(convocatoria);
        setResponse(response);

        if (!response.error) {
            await getConvocatorias();
            setOpenSnackbar(true);
            setTimeout(() => {
                router.push("/convocatorias"); // 🔹 Redirección a la lista de convocatorias
            }, 1500);
        }
        setLoading(false);
    };

    return (
        <Box sx={sx}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Crear Convocatoria
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                    Ingresa los datos para crear una nueva convocatoria.
                </Typography>

                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel htmlFor="titulo">Título</FormLabel>
                        <TextField
                            id="titulo"
                            name="titulo"
                            placeholder="Título de la convocatoria"
                            required
                            fullWidth
                            helperText={response?.error}
                            error={!!response?.error}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel htmlFor="descripcion">Descripción</FormLabel>
                        <TextField
                            multiline
                            required
                            id="descripcion"
                            name="descripcion"
                            placeholder="Descripción de la convocatoria"
                            variant="outlined"
                            fullWidth
                            helperText={response?.error}
                            error={!!response?.error}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Fecha de inicio</FormLabel>
                        <CustomDatePicker
                            value={fechaInicio}
                            onChange={(newValue) => setFechaInicio(newValue || dayjs())}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Fecha de finalización</FormLabel>
                        <CustomDatePicker
                            value={fechaFin}
                            onChange={(newValue) => setFechaFin(newValue || dayjs())}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Rúbrica</FormLabel>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <RubricaDropdown setShowCreateRubrica={setShowCreateRubrica} />
                            <Button
                                variant="outlined"
                                color="primary"
                                sx={{ fontSize: "0.8rem", display: "flex", gap: 1 }}
                                onClick={() => {
                                    clearSelectedRubrica();
                                    setShowCreateRubrica(true)
                                }}
                            >
                                <AddIcon />
                                <span>Crear</span>
                            </Button>
                        </Box>
                    </FormControl>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            router.back();
                        }}
                        sx={{ mr: 2 }}
                    >
                        Cancelar
                    </Button>
                    <AnimatedButton loading={loading} text="Crear convocatoria" />
                </form>
            </Paper>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Convocatoria creada con éxito.
                </Alert>
            </Snackbar>
        </Box>
    );
}