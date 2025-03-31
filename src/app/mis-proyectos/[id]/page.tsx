"use client";

import React, { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import {
    Typography,
    Paper,
    Grid,
    Chip,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Box,
    CircularProgress,
} from "@mui/material";
import getProjectById from '@/modules/projects/server/get-project-by-id';
import { Project } from "@/modules/projects/project-type";
import PdfViewer from "@/components/pdf-viewer";
import EvaluacionDetalle from "@/modules/evaluaciones/components/evaluacion-detalle";
import getEvaluacionPorProyecto from "@/modules/projects/server/get-evaluacion-projecto";
import { Evaluacion } from "@/modules/evaluaciones/evaluacion-type";


export default function ProyectoDetalle() {
    const { id }: { id: string } = useParams();

    const [proyecto, setProyecto] = useState<Project | null>(null);
    const [evaluacion, setEvaluacion] = useState<Evaluacion | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getProjectById(id as string).then((data) => {
            setProyecto(data);
            if (data?.evaluacion) {
                getEvaluacionPorProyecto(id as string).then((evaluacion) => {
                    setEvaluacion(evaluacion);
                });
            }
        });

        setLoading(false);
    }, [id]);


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!loading && proyecto) {
        return (
            <Paper elevation={3} sx={{ padding: 4, width: "100%", margin: "auto", mt: 4 }}>
                <Grid container spacing={4}>
                    {/* ✅ Columna Izquierda (70%) */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" fontWeight="bold">{proyecto.titulo}</Typography>
                        <Typography variant="subtitle1" color="textSecondary">{proyecto.convocatoria?.titulo}</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>{proyecto.resumen}</Typography>

                        <Grid container spacing={2} sx={{ mt: 3 }}>
                            <Grid item xs={6}>
                                <Typography><strong>Fecha de Inicio:</strong></Typography>
                                <Chip
                                    label={dayjs(proyecto.fechaInicio).format("DD-MM-YYYY")}
                                    color="info"
                                    sx={{ fontWeight: "bold", fontSize: "1rem", py: 1 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><strong>Fecha de Fin:</strong></Typography>
                                <Chip
                                    label={dayjs(proyecto.fechaFin).format("DD-MM-YYYY")}
                                    color="error"
                                    sx={{ fontWeight: "bold", fontSize: "1rem", py: 1 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography><strong>Duración:</strong> {proyecto.tiempoEjecucion} meses</Typography>
                            </Grid>
                            {proyecto?.documentoUrl ? (
                                <PdfViewer url={proyecto?.documentoUrl ?? ""} />
                            ) : (
                                <Typography variant="body1">No hay documento disponible</Typography>
                            )}

                        </Grid>
                    </Grid>

                    {/* ✅ Columna Derecha (30%) */}
                    <Grid item xs={12} md={4}>
                        {/* Estado de Evaluación */}
                        <Typography variant="h6" fontWeight="bold">Estado del Proyecto</Typography>
                        <Chip
                            label={proyecto.evaluacion ? "✅ Calificado" : "⏳ Pendiente por calificar"}
                            color={proyecto.evaluacion ? "success" : "warning"}
                            sx={{ py: 3, px: 3, fontWeight: "bold", fontSize: "1.2rem" }}
                        />

                        {evaluacion && (
                            <EvaluacionDetalle evaluacion={evaluacion} />
                        )}

                        <Divider sx={{ my: 2 }} />

                        {/* Lista de Estudiantes */}
                        <Typography variant="h6" fontWeight="bold">Estudiantes</Typography>
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold", pl: 0 }}>Nombre</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", pl: 0 }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", pl: 0 }} align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {proyecto.estudiantes.map((estudiante) => (
                                        <TableRow key={estudiante.id}>
                                            <TableCell sx={{ pl: 0 }}>{estudiante.fullname}</TableCell>
                                            <TableCell sx={{ pl: 0 }}>{estudiante.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Grid>
                </Grid>
            </Paper >
        );
    }
};