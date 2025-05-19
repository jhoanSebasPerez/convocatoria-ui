"use client";

import { Project } from "@/modules/projects/project-type";
import getProjetById from "@/modules/projects/server/get-project-by-id";
import { Criterio, Rubrica } from "@/modules/rubricas/rubrica-types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Convocatoria } from '../../../modules/convocatorias/convocatoria-types';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";
import PdfViewer from "@/components/pdf-viewer";
import { ArticleOutlined, Assignment, CalendarToday, Category, Description, ErrorOutline, School, Shield } from "@mui/icons-material";
import ProyectoEvaluacion from "@/modules/evaluaciones/components/evaluation-section";
import { Evaluacion } from "@/modules/evaluaciones/evaluacion-type";
import createEvaluacion from "@/modules/evaluaciones/server/create-evaluacion";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";


export default function ProyectoPorCalificarPage() {

    const { id }: { id: string } = useParams();

    const [proyecto, setProyecto] = useState<Project | null>(null);
    const [convocatoria, setConvocatoria] = useState<Convocatoria | undefined>(undefined);
    const [rubrica, setRubrica] = useState<Rubrica | undefined>(undefined);
    const [criterios, setCriterios] = useState<Criterio[] | undefined>(undefined);

    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        if (id) {
            getProjetById(id).then((proyecto) => {
                setLoading(false);
                setProyecto(proyecto);
                setConvocatoria(proyecto?.convocatoria);
                setRubrica(proyecto?.convocatoria?.rubrica);
                setCriterios(proyecto?.convocatoria?.rubrica?.criterios);
            });
        }
    }, [id]);

    // Función para formatear fechas del proyecto (fechaInicio o fechaFin)
    const formatearFecha = (fecha: string | undefined) => {
        if (!fecha) return "Fecha no disponible";
        try {
            return formatDistanceToNow(new Date(fecha), {
                addSuffix: true,
                locale: es
            });
        } catch (e) {
            return "Fecha inválida";
        }
    };

    // Estado de carga centralizado
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: '60vh',
                        justifyContent: 'center'
                    }}
                >
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
                        Cargando información del proyecto...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    // Manejar la calificación del proyecto
    const handleEvaluacion = async (evaluacion: Evaluacion) => {
        setLoading(true);
        try {
            const response = await createEvaluacion(evaluacion);

            if (!response.error) {
                setShowToast(true);
            } else {
                setError("Error al guardar la evaluación para el proyecto");
            }
        } catch (err) {
            setError("Ocurrió un error al procesar la evaluación");
            console.error("Error en la evaluación:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Encabezado del proyecto */}
            <Card elevation={2} sx={{ mb: 3, overflow: 'visible' }}>
                <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                    sx={{
                                        bgcolor: proyecto?.tipoProyecto === "AULA" ? "primary.main" : "secondary.main",
                                        width: 56,
                                        height: 56
                                    }}
                                >
                                    {proyecto?.tipoProyecto === "AULA" ?
                                        <School fontSize="large" /> :
                                        <ArticleOutlined fontSize="large" />}
                                </Avatar>
                                <Stack spacing={0.5}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                        {proyecto?.titulo || "Sin título"}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {convocatoria?.titulo || "Convocatoria no especificada"}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card
                                variant="outlined"
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    p: 2
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Tipo de proyecto
                                </Typography>
                                <Chip
                                    icon={proyecto?.tipoProyecto === "AULA" ? <School /> : <Assignment />}
                                    label={proyecto?.tipoProyecto === "AULA" ? "Proyecto de Aula" : "Proyecto de Semillero"}
                                    color={proyecto?.tipoProyecto === "AULA" ? "primary" : "secondary"}
                                    sx={{ fontWeight: "bold", px: 1 }}
                                    size="medium"
                                />
                            </Card>
                        </Grid>
                    </Grid>
                    {/* Columna izquierda - Información del proyecto */}
                    <Grid item xs={12} md={4} mt={2}>
                        {/* Detalles del proyecto */}
                        <Card elevation={1} sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack spacing={2}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Description fontSize="small" /> Resumen del Proyecto
                                    </Typography>
                                    <Divider />
                                    <Typography variant="body1">
                                        {proyecto?.resumen || "Este proyecto no tiene un resumen disponible."}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CalendarToday fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                Fecha inicio: {formatearFecha(proyecto?.fechaInicio)}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CalendarToday fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                Fecha fin: {formatearFecha(proyecto?.fechaFin)}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </CardContent>
            </Card>

            {/* Visor de PDF - Ahora a ancho completo y más prominente */}
            <Card elevation={2} sx={{ mb: 3, height: '1000px', overflow: 'hidden' }}>
                <CardContent sx={{ p: 2, height: '100%' }}>
                    {proyecto?.documentoUrl ? (
                        <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
                            <PdfViewer url={proyecto.documentoUrl} />
                        </Box>
                    ) : (
                        <Paper
                            variant="outlined"
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 4,
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            <Assignment sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No hay documento disponible
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                El estudiante no ha subido ningún documento para este proyecto.
                            </Typography>
                        </Paper>
                    )}
                </CardContent>
            </Card>

            {/* Contenido secundario en estructura de dos columnas */}
            <Grid container>

                {/* Columna derecha - Rúbrica y evaluación */}
                <Grid item md={12}>
                    <Card elevation={1}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack spacing={2}>
                                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Category fontSize="small" /> Rúbrica de Evaluación
                                </Typography>
                                <Divider />

                                {rubrica ? (
                                    <>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {rubrica.nombre}
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            {rubrica.descripcion}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No hay una rúbrica asignada para este proyecto.
                                    </Typography>
                                )}

                                {/* Error de evaluación */}
                                {error && (
                                    <Alert
                                        severity="error"
                                        icon={<ErrorOutline />}
                                        sx={{ mt: 2 }}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                {/* Componente de evaluación */}
                                {proyecto && rubrica && criterios && (
                                    <Box sx={{ mt: 2 }}>
                                        <ProyectoEvaluacion
                                            proyecto={proyecto}
                                            rubrica={rubrica}
                                            criterios={criterios}
                                            onSubmit={handleEvaluacion}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Notificación de éxito */}
            <Snackbar
                open={showToast}
                autoHideDuration={6000}
                onClose={() => setShowToast(false)}
            >
                <Alert severity="success" onClose={() => setShowToast(false)}>
                    Se ha guardado la calificación para el proyecto exitosamente
                </Alert>
            </Snackbar>
        </Container>
    );

}