"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import getProjectById from '@/modules/projects/server/get-project-by-id';
import { Project } from "@/modules/projects/project-type";
import { Evaluacion } from "@/modules/evaluaciones/evaluacion-type";
import getEvaluacionPorProyecto from "@/modules/projects/server/get-evaluacion-projecto";
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import PdfViewer from "@/components/pdf-viewer";
import EvaluacionDetalle from "@/modules/evaluaciones/components/evaluacion-detalle";
import {
    Description,
    School,
    Assignment,
    Grading,
    TextSnippet,
    FilePresent,
    Category
} from "@mui/icons-material";

export default function EvaluacionPorProyecto() {
    const { id }: { id: string } = useParams();

    const [project, setProject] = useState<Project | null>(null);
    const [evaluacion, setEvaluacion] = useState<Evaluacion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [projectData, evaluacionData] = await Promise.all([
                    getProjectById(id),
                    getEvaluacionPorProyecto(id)
                ]);

                setProject(projectData);
                setEvaluacion(evaluacionData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Ocurrió un error al cargar los datos del proyecto');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 10, height: '60vh' }}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>Cargando información del proyecto...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
            </Container>
        );
    }

    if (!project) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={2} sx={{ p: 6, mt: 4, textAlign: 'center', borderRadius: 2 }}>
                    <Assignment sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>Proyecto no encontrado</Typography>
                    <Typography variant="body1" color="text.secondary">El proyecto que intentas visualizar no existe o ha sido eliminado</Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Encabezado del proyecto */}
            <Card elevation={3} sx={{ mb: 6, overflow: 'visible', borderRadius: 2 }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: project?.tipoProyecto === "AULA" ? 'primary.main' : 'secondary.main', width: 64, height: 64 }}>
                            {project?.tipoProyecto === "AULA" ? <School fontSize="large" /> : <Category fontSize="large" />}
                        </Avatar>
                    }
                    title={
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5, mt: 0.5 }}>{project?.titulo}</Typography>
                    }
                    subheader={
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mt: 1 }}>
                            {project?.convocatoria && (
                                <Tooltip title="Convocatoria">
                                    <Chip
                                        icon={<Assignment />}
                                        label={project.convocatoria.titulo}
                                        variant="outlined"
                                        size="medium"
                                        sx={{ fontWeight: 500, py: 0.75, px: 0.5 }}
                                    />
                                </Tooltip>
                            )}
                            <Tooltip title="Tipo de proyecto">
                                <Chip
                                    icon={project?.tipoProyecto === "AULA" ? <School /> : <Category />}
                                    label={project?.tipoProyecto}
                                    color={project?.tipoProyecto === "AULA" ? "primary" : "secondary"}
                                    size="medium"
                                    sx={{ fontWeight: "bold", py: 0.75 }}
                                />
                            </Tooltip>
                        </Stack>
                    }
                    sx={{ pb: 2 }}
                />
                <Divider />
                <CardContent sx={{ py: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                        <Description sx={{ color: 'text.secondary', mt: 0.5, fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="bold">Resumen</Typography>
                    </Stack>
                    <Typography variant="body1" paragraph sx={{ pl: 5, mt: 1.5, lineHeight: 1.6 }}>
                        {project?.resumen || "No hay resumen disponible"}
                    </Typography>
                </CardContent>
            </Card>

            {/* Visor de documento a ancho completo */}
            {project?.documentoUrl ? (
                <Card elevation={3} sx={{ mb: 6, borderRadius: 2 }}>
                    <CardHeader
                        avatar={<Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}><FilePresent sx={{ fontSize: 26 }} /></Avatar>}
                        title={<Typography variant="h5" sx={{ fontWeight: 600, my: 0.5 }}>Documento del Proyecto</Typography>}
                        action={
                            <Chip
                                label="Documento PDF"
                                color="secondary"
                                icon={<FilePresent />}
                                variant="outlined"
                                sx={{ fontWeight: 500, mt: 1, mr: 1 }}
                            />
                        }
                        sx={{ pb: 1 }}
                    />
                    <Divider />
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ height: '900px', width: '100%', mt: 2, borderRadius: 1, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
                            <PdfViewer url={project.documentoUrl} />
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Paper elevation={2} sx={{ p: 8, mb: 6, textAlign: 'center', borderRadius: 2 }}>
                    <FilePresent sx={{ fontSize: 90, color: 'text.disabled', mb: 4 }} />
                    <Typography variant="h4" gutterBottom>No hay documento disponible</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', maxWidth: '600px', mx: 'auto', mt: 2 }}>
                        Este proyecto no tiene ningún documento PDF adjunto para visualizar
                    </Typography>
                </Paper>
            )}

            {/* Información de evaluación */}
            <Card elevation={3} sx={{ borderRadius: 2, mb: 6 }}>
                <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}><Grading sx={{ fontSize: 26 }} /></Avatar>}
                    title={<Typography variant="h5" sx={{ fontWeight: 600, my: 0.5 }}>Información de Evaluación</Typography>}
                    sx={{ pb: 1 }}
                />
                <Divider />
                <CardContent sx={{ py: 4, px: 3 }}>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={3}>
                                <Box sx={{ backgroundColor: 'primary.50', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'primary.100' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                        <TextSnippet sx={{ color: 'primary.main', fontSize: 26 }} />
                                        <Typography variant="h6" fontWeight="bold">Rúbrica</Typography>
                                    </Stack>
                                    <Typography variant="h6" sx={{ pl: 4, color: 'primary.main', fontWeight: 600, mb: 1.5 }}>
                                        {evaluacion?.rubrica?.nombre || "Sin rúbrica asignada"}
                                    </Typography>
                                    <Typography variant="body1" sx={{ pl: 4, color: 'text.secondary', lineHeight: 1.5 }}>
                                        {evaluacion?.rubrica?.descripcion || "No hay descripción disponible"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                                {evaluacion ? (
                                    <Box sx={{ pt: 1 }}>
                                        <EvaluacionDetalle evaluacion={evaluacion} />
                                    </Box>
                                ) : (
                                    <Box sx={{ p: 5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Grading sx={{ fontSize: 70, color: 'text.disabled', mb: 3 }} />
                                        <Typography variant="h5" gutterBottom>Sin evaluación</Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '80%', mx: 'auto', mt: 1 }}>
                                            Este proyecto aún no ha sido evaluado
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}