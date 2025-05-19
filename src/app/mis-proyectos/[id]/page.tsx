"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import {
    Typography,
    Paper,
    Grid,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Box,
    CircularProgress,
    Card,
    CardContent,
    Container,
    Stack,
    Avatar,
    IconButton,
    Tooltip,
} from "@mui/material";
import { CalendarMonth, Description, AccessTime, Groups, Email } from "@mui/icons-material";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProjectById(id as string);
                setProyecto(data);

                if (data?.evaluacion) {
                    const evaluacionData = await getEvaluacionPorProyecto(id as string);
                    setEvaluacion(evaluacionData);
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="h6" sx={{ ml: 2 }}>Cargando proyecto...</Typography>
                </Box>
            </Container>
        );
    }

    if (!proyecto) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">No se encontró el proyecto solicitado</Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            {/* Header Section */}
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {proyecto.titulo}
                </Typography>

                <Chip
                    label={proyecto.convocatoria?.titulo}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 3 }}
                />

                <Card sx={{ mb: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                    <CardContent>
                        <Typography variant="body1">
                            {proyecto.resumen}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Project Timeline Info */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Card elevation={2}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Avatar sx={{ bgcolor: '#bbdefb' }}>
                                        <CalendarMonth color="primary" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            Fecha de Inicio
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {dayjs(proyecto.fechaInicio).format("DD-MM-YYYY")}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card elevation={2}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Avatar sx={{ bgcolor: '#ffcdd2' }}>
                                        <CalendarMonth color="error" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            Fecha de Fin
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {dayjs(proyecto.fechaFin).format("DD-MM-YYYY")}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card elevation={2}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Avatar sx={{ bgcolor: '#e1f5fe' }}>
                                        <AccessTime color="info" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            Duración
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {proyecto.tiempoEjecucion} meses
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Main Content - Two Columns */}
            <Grid container spacing={3}>
                {/* Left Column - Students */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <Groups color="primary" />
                            <Typography variant="h6" fontWeight="bold">Estudiantes</Typography>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {proyecto.estudiantes.map((estudiante) => (
                            <Card key={estudiante.id} sx={{ mb: 2, bgcolor: '#fafafa' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body1" fontWeight="bold">
                                            {estudiante.fullname}
                                        </Typography>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Email fontSize="small" color="action" />
                                            <Typography variant="body2" color="textSecondary">
                                                {estudiante.email}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                </Grid>

                {/* Right Column - Evaluation */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Estado del Proyecto</Typography>
                        <Chip
                            label={proyecto.evaluacion ? "✅ Calificado" : "⏳ Pendiente por calificar"}
                            color={proyecto.evaluacion ? "success" : "warning"}
                            sx={{ py: 2, px: 2, fontWeight: "bold", fontSize: "1rem", mb: 3 }}
                        />

                        {evaluacion ? (
                            <Box sx={{ mt: 2 }}>
                                <EvaluacionDetalle evaluacion={evaluacion} />
                            </Box>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                Este proyecto aún no ha sido evaluado.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* PDF Viewer - Full Width (Preserved as requested) */}
            <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: '12px' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Description color="primary" />
                    <Typography variant="h6" fontWeight="bold">Documento del Proyecto</Typography>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {proyecto?.documentoUrl ? (
                    <Box sx={{ width: "100%" }}>
                        <PdfViewer url={proyecto.documentoUrl} />
                    </Box>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                        <Typography variant="body1" color="textSecondary">
                            No hay documento disponible para este proyecto
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}