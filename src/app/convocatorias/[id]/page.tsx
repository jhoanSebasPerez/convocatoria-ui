"use client";

import { Convocatoria } from "@/modules/convocatorias/convocatoria-types";
import getConvocatoriaById from "@/modules/convocatorias/server/get-convocatoria-by-id";
import ProjectsTableByConvocatoria from "@/modules/projects/section/projects-by-convocatoria-table";
import { useRubricaStore } from "@/modules/rubricas/rubrica-store";
import RubricaConvocatoria from "@/modules/rubricas/sections/rubrica-convocatoria";
import RubricaDetail from "@/modules/rubricas/sections/rubrica-detail";
import {
    Typography,
    Paper,
    Divider,
    Box,
    Chip,
    Stack,
    CircularProgress,
    Container,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Alert,
    Skeleton
} from "@mui/material";
import {
    CalendarMonth,
    Timelapse,
    Description,
    Assignment,
    CheckCircle,
    Cancel,
    ListAlt
} from "@mui/icons-material";
import { use, useEffect, useState } from "react";

type ConvocatoriaDetailPageProps = {
    readonly params: Promise<{ id: string }>;
}

export default function ConvocatoriaDetailPage({ params }: ConvocatoriaDetailPageProps) {
    const { id } = use(params);
    const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formattedDates, setFormattedDates] = useState<{ inicio: string; fin: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getConvocatoriaById(id);

                if (!data) {
                    setError("No se encontró la convocatoria solicitada");
                    setLoading(false);
                    return;
                }

                setConvocatoria(data);

                // Formatear fechas en el cliente
                setFormattedDates({
                    inicio: new Date(data.fechaInicio).toLocaleDateString("es-CO"),
                    fin: new Date(data.fechaFin).toLocaleDateString("es-CO"),
                });
            } catch (err) {
                console.error("Error al cargar la convocatoria:", err);
                setError("Ocurrió un error al cargar los datos de la convocatoria");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 8 }}>
                    <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
                    <Typography variant="h6" color="text.secondary">
                        Cargando información de la convocatoria...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mt: 4, borderRadius: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!convocatoria) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
                    <Assignment sx={{ fontSize: 70, color: 'text.disabled', mb: 3 }} />
                    <Typography variant="h5" gutterBottom>Convocatoria no encontrada</Typography>
                    <Typography variant="body1" color="text.secondary">
                        La convocatoria que estás buscando no existe o ha sido eliminada
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Encabezado principal */}
            <Card elevation={3} sx={{ mb: 5, overflow: 'visible', borderRadius: 2 }}>
                <CardHeader
                    title={
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {convocatoria.titulo}
                            </Typography>
                            <Chip
                                icon={convocatoria.isActive ? <CheckCircle /> : <Cancel />}
                                label={convocatoria.isActive ? "Activa" : "Inactiva"}
                                color={convocatoria.isActive ? "success" : "error"}
                                sx={{ fontWeight: "bold", px: 1, py: 2.5 }}
                            />
                        </Stack>
                    }
                    sx={{ pb: 1 }}
                />
                <Divider />
                <CardContent sx={{ pt: 3, pb: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            {/* Descripción */}
                            <Box sx={{ mb: 4 }}>
                                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Description sx={{ color: 'text.secondary', fontSize: 28 }} />
                                    <Typography variant="h6" fontWeight="bold">Descripción</Typography>
                                </Stack>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        pl: 5,
                                        color: 'text.secondary',
                                        lineHeight: 1.6,
                                        fontSize: '1.05rem'
                                    }}
                                >
                                    {convocatoria.descripcion}
                                </Typography>
                            </Box>

                            {/* Fechas - Versión más compacta */}
                            {formattedDates && (
                                <Box sx={{ mb: 2 }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                                        <CalendarMonth sx={{ color: 'text.secondary', fontSize: 24 }} />
                                        <Typography variant="h6" fontWeight="bold">Fechas</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={3} sx={{ pl: 5 }}>
                                        <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'primary.light', flex: 1 }}>
                                            <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                        <CalendarMonth sx={{ fontSize: 18 }} />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="caption" fontWeight="medium" color="text.secondary">
                                                            Fecha de inicio
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                                                            {formattedDates.inicio}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                        <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'warning.light', flex: 1 }}>
                                            <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                                                        <Timelapse sx={{ fontSize: 18 }} />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="caption" fontWeight="medium" color="text.secondary">
                                                            Fecha de cierre
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'warning.main' }}>
                                                            {formattedDates.fin}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Stack>
                                </Box>
                            )}
                        </Grid>

                        {/* Sección de rúbrica - Ahora más grande */}
                        <Grid item xs={12} md={5}>
                            <Card elevation={2} sx={{ borderRadius: 2, height: '100%', border: '1px solid', borderColor: 'primary.100' }}>
                                <CardHeader
                                    title={
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                                <Assignment sx={{ fontSize: 24 }} />
                                            </Avatar>
                                            <Typography variant="h5" fontWeight="bold">Rúbrica de evaluación</Typography>
                                        </Stack>
                                    }
                                    sx={{ pb: 0.5, backgroundColor: 'primary.50' }}
                                />
                                <Divider />
                                <CardContent sx={{ pt: 3, pb: 2 }}>
                                    <Box sx={{ minHeight: 200 }}>
                                        <RubricaConvocatoria convocatoria={convocatoria} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Sección de proyectos */}
            <Card elevation={3} sx={{ borderRadius: 2, mb: 4 }}>
                <CardHeader
                    title={
                        <Stack direction="row" spacing={2} alignItems="center">
                            <ListAlt sx={{ color: 'text.secondary', fontSize: 28 }} />
                            <Typography variant="h5" fontWeight="bold">Proyectos de la convocatoria</Typography>
                        </Stack>
                    }
                    sx={{ pb: 1 }}
                />
                <Divider />
                <CardContent sx={{ pt: 3 }}>
                    <ProjectsTableByConvocatoria proyectos={convocatoria.proyectos ?? []} />
                </CardContent>
            </Card>
        </Container>
    );
}