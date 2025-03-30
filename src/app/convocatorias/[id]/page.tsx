"use client";

import { Convocatoria } from "@/modules/convocatorias/convocatoria-types";
import getConvocatoriaById from "@/modules/convocatorias/server/get-convocatoria-by-id";
import ProjectsTableByConvocatoria from "@/modules/projects/section/projects-by-convocatoria-table";
import { useRubricaStore } from "@/modules/rubricas/rubrica-store";
import RubricaConvocatoria from "@/modules/rubricas/sections/rubrica-convocatoria";
import RubricaDetail from "@/modules/rubricas/sections/rubrica-detail";
import { Typography, Paper, Divider, Box, Chip, Stack, CircularProgress } from "@mui/material";
import { use, useEffect, useState } from "react";

type ConvocatoriaDetailPageProps = {
    readonly params: Promise<{ id: string }>;
}


export default function ConvocatoriaDetailPage({ params }: ConvocatoriaDetailPageProps) {
    const { id } = use(params);
    const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null);
    const [loading, setLoading] = useState(true);
    const [formattedDates, setFormattedDates] = useState<{ inicio: string; fin: string } | null>(null);

    useEffect(() => {
        setLoading(true);

        getConvocatoriaById(id).then((convocatoria) => {
            if (!convocatoria) {
                console.log("convocatoria", convocatoria);
                setLoading(false);
                return;
            }

            setConvocatoria(convocatoria);

            // ✅ Evitar renderizado de fechas en SSR, calculando en el cliente
            setFormattedDates({
                inicio: new Date(convocatoria.fechaInicio).toLocaleDateString("es-CO"),
                fin: new Date(convocatoria.fechaFin).toLocaleDateString("es-CO"),
            });

            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!loading && convocatoria) {
        return (
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: "background.paper" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h4" fontWeight="bold" sx={{ color: "primary" }}>
                                {convocatoria.titulo.toUpperCase()}
                            </Typography>
                            <Chip
                                label={convocatoria.isActive ? "Activa" : "Inactiva"}
                                color={convocatoria.isActive ? "success" : "error"}
                                sx={{ fontWeight: "bold", fontSize: "0.9rem", padding: "1rem" }}
                            />
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* 🔹 Descripción */}
                        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                            {convocatoria.descripcion}
                        </Typography>

                        {/* 🔹 Fechas (Solo se renderizan si `formattedDates` está disponible) */}
                        {formattedDates && (
                            <Stack spacing={2}>
                                <Chip
                                    label={`📅 Inicio: ${formattedDates.inicio}`}
                                    color="info"
                                    variant="outlined"
                                    sx={{ fontWeight: "bold", px: 1.5, padding: "1rem" }}
                                />
                                <Chip
                                    label={`⏳ Fin: ${formattedDates.fin}`}
                                    color="warning"
                                    variant="outlined"
                                    sx={{ fontSize: "1.5rem", fontWeight: "bold", px: 1.5, padding: "1rem" }}
                                />
                            </Stack>
                        )}
                    </Box>
                    <Box>
                        <RubricaConvocatoria convocatoria={convocatoria} />
                    </Box>
                </Box>

                <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
                    Proyectos
                </Typography>
                <ProjectsTableByConvocatoria proyectos={convocatoria.proyectos ?? []} />
            </Paper>

        );
    }
}