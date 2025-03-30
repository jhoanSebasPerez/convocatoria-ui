"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from "@mui/material";
import createDocente from "../server/create-docente";

interface DocenteFormValues {
    fullname: string;
    email: string;
}

// ✅ Validaciones con Yup
const docenteSchema = yup.object().shape({
    fullname: yup.string().required("El nombre es obligatorio"),
    email: yup.string().email("Email inválido").required("El email es obligatorio"),
});

export default function AddDocenteModal(
    { showModal, setShowModal }
        : { readonly showModal: boolean, readonly setShowModal: (showModal: boolean) => void }) {
    const [loading, setLoading] = React.useState(false);

    const { handleSubmit, control, reset } = useForm<DocenteFormValues>({
        resolver: yupResolver(docenteSchema),
    });

    const onSubmit = async (data: DocenteFormValues) => {
        setLoading(true);

        try {
            const response = await createDocente(data);
            console.log(response)

            if (response.error) throw new Error(response.error || "Error creando docente");

            alert("✅ Docente agregado correctamente");
            setShowModal(false);
            reset();
        } catch (error: any) {
            alert(`❌ Error agregando docente: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Agregar Docente</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack spacing={2}>
                        <Controller
                            name="fullname"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} placeholder="Nombre Completo" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} placeholder="Correo Electrónico" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)} color="error" disabled={loading}>Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? "Guardando..." : "Agregar"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}