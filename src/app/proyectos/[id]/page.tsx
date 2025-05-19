"use client"

import {
    Typography,
    Paper,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemText,
    Box,
    Button,
    CircularProgress,
    Container,
    Card,
    CardContent,
    Grid,
    Avatar,
    Stack,
    Alert,
    Tab,
    Tabs,
} from "@mui/material";
import {
    Article,
    AssignmentInd,
    CalendarMonth,
    Description,
    School,
    Timer,
    Person,
    PeopleAlt,
    Science,
    Assignment,
    Domain
} from "@mui/icons-material";
import { Project } from "@/modules/projects/project-type";
import getProjectById from '@/modules/projects/server/get-project-by-id';
import StudentTable from "@/modules/projects/section/students-table";
import PdfViewer from "@/components/pdf-viewer";
import AsignarEvaluadorModal from "@/modules/projects/components/asign-evaluador-modal";
import { useEffect, useState, use, SyntheticEvent } from "react";

type ProyectoDetailPageProps = {
    readonly params: Promise<{
        id: string;
    }>;
}

export default function ProyectoDetailPage({ params }: ProyectoDetailPageProps) {
    const { id } = use(params);

    const [proyecto, setProyecto] = useState<Project | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Formatear fechas para mejor legibilidad
    const formatearFecha = (fechaString?: string) => {
        if (!fechaString) return "No disponible";
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString("es-CO", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        setLoading(true);
        getProjectById(id as string).then((data) => {
            setProyecto(data);
            setLoading(false);
        }).catch(error => {
            console.error("Error al cargar proyecto:", error);
            setLoading(false);
        });
    }, [id]);

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
                    <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
                        Cargando información del proyecto...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    if (proyecto) {
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
                                            <Science fontSize="large" />}
                                    </Avatar>
                                    <Stack spacing={0.5}>
                                        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                            {proyecto?.titulo || "Sin título"}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Convocatoria: {proyecto?.convocatoria?.titulo || "No especificada"}
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
                                        icon={proyecto?.tipoProyecto === "AULA" ? <School /> : <Science />}
                                        label={proyecto?.tipoProyecto === "AULA" ? "Proyecto de Aula" : "Proyecto de Semillero"}
                                        color={proyecto?.tipoProyecto === "AULA" ? "primary" : "secondary"}
                                        sx={{ fontWeight: "bold", px: 1 }}
                                        size="medium"
                                    />
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Datos principales */}
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={4} md={2}>
                                <Card variant="outlined" sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CalendarMonth color="primary" sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                                        Fecha de inicio
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" align="center">
                                        {formatearFecha(proyecto.fechaInicio)}
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4} md={2}>
                                <Card variant="outlined" sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CalendarMonth color="error" sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                                        Fecha de fin
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" align="center">
                                        {formatearFecha(proyecto.fechaFin)}
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4} md={2}>
                                <Card variant="outlined" sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Timer color="success" sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                                        Duración
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" align="center">
                                        {proyecto.tiempoEjecucion} meses
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    {proyecto.evaluador && proyecto.evaluador?.id ? (
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: "warning.main" }}>
                                                <Person />
                                            </Avatar>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Docente evaluador
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {proyecto.evaluador?.fullname}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    ) : (
                                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                            <Typography variant="body1" color="text.secondary">
                                                No hay evaluador asignado
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setOpenModal(true)}
                                                startIcon={<AssignmentInd />}
                                            >
                                                Asignar evaluador
                                            </Button>
                                            <AsignarEvaluadorModal
                                                proyectoId={id as string}
                                                open={openModal}
                                                onClose={() => setOpenModal(false)}
                                            />
                                        </Stack>
                                    )}
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Visor de PDF - Prominente y a ancho completo */}
                <Card elevation={2} sx={{ mb: 3, height: '750px', overflow: 'hidden' }}>
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

                {/* Pestañas para organizar la información detallada */}
                <Card elevation={1}>
                    <CardContent sx={{ p: 0 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Resumen" icon={<Description />} iconPosition="start" />
                            <Tab label="Estudiantes" icon={<PeopleAlt />} iconPosition="start" />
                            <Tab label="Detalles" icon={<Article />} iconPosition="start" />
                        </Tabs>

                        {/* Contenido de la pestaña de Resumen */}
                        {activeTab === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Resumen del Proyecto
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                                    {proyecto.resumen}
                                </Typography>
                            </Box>
                        )}

                        {/* Contenido de la pestaña de Estudiantes */}
                        {activeTab === 1 && (
                            <Box sx={{ p: 3 }}>
                                <StudentTable estudiantes={proyecto.estudiantes} />
                            </Box>
                        )}

                        {/* Contenido de la pestaña de Detalles */}
                        {activeTab === 2 && (
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    {/* Detalles para Proyecto de Aula */}
                                    {proyecto.proyectoAula && (
                                        <Grid item xs={12} md={6}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                                        <School color="primary" />
                                                        <Typography variant="h6" fontWeight="bold">
                                                            Proyecto de Aula
                                                        </Typography>
                                                    </Stack>
                                                    <Divider sx={{ mb: 2 }} />
                                                    <List dense disablePadding>
                                                        <ListItem divider>
                                                            <ListItemText
                                                                primary="Curso"
                                                                secondary={proyecto.proyectoAula.curso}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                        <ListItem divider>
                                                            <ListItemText
                                                                primary="Docente Orientador"
                                                                secondary={proyecto.proyectoAula.docenteOrientador}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                        <ListItem divider>
                                                            <ListItemText
                                                                primary="Estado de Formulación"
                                                                secondary={proyecto.proyectoAula.estadoFormulacion}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                        <ListItem divider>
                                                            <ListItemText
                                                                primary="Estado de Ejecución"
                                                                secondary={proyecto.proyectoAula.estadoEjecucion}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                        <ListItem divider>
                                                            <ListItemText
                                                                primary="Estado de Terminación"
                                                                secondary={proyecto.proyectoAula.estadoTerminado}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                        <ListItem divider>
                                                            <ListItemText
                                                                primary="Tipo de Proyecto"
                                                                secondary={proyecto.proyectoAula.tipoProyecto}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary="Modalidad de Presentación"
                                                                secondary={proyecto.proyectoAula.modalidadPresentacion}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )}

                                    {/* Detalles para Proyecto de Semillero */}
                                    {proyecto.proyectoSemillero && (
                                        <Grid item xs={12} md={6}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                                        <Science color="secondary" />
                                                        <Typography variant="h6" fontWeight="bold">
                                                            Proyecto de Semillero
                                                        </Typography>
                                                    </Stack>
                                                    <Divider sx={{ mb: 2 }} />
                                                    <List dense disablePadding>
                                                        <ListItem divider>
                                                            <ListItemText
                                                                primary="Nombre del Semillero"
                                                                secondary={proyecto.proyectoSemillero.nombreSemillero}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                        <ListItem divider>
                                                            <ListItemText
                                                                primary="Sigla del Semillero"
                                                                secondary={proyecto.proyectoSemillero.siglaSemillero}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                        <ListItem divider>
                                                            <ListItemText
                                                                primary="Director del Semillero"
                                                                secondary={proyecto.proyectoSemillero.directorSemillero}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary="Modalidad de Presentación"
                                                                secondary={proyecto.proyectoSemillero.modalidadPresentacion}
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>
        );
    }
}