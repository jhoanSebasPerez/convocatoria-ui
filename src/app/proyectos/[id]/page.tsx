"use client"

import {
    Typography,
    Paper,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemText,
    Grid2,
    Box,
    Button,
    CircularProgress,
} from "@mui/material";
import { Project } from "@/modules/projects/project-type";
import getProjectById from '@/modules/projects/server/get-project-by-id';
import StudentTable from "@/modules/projects/section/students-table";
import PdfViewer from "@/components/pdf-viewer";
import AsignarEvaluadorModal from "@/modules/projects/components/asign-evaluador-modal";
import { useEffect, useState, use } from "react";

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

    useEffect(() => {
        setLoading(true);
        getProjectById(id as string).then((data) => {
            setProyecto(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (proyecto) {
        return (
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {proyecto.titulo}
                </Typography>

                <Chip
                    label={proyecto.tipoProyecto}
                    color={proyecto.tipoProyecto === "AULA" ? "primary" : "secondary"}
                    sx={{ mb: 1, fontWeight: "bold" }}
                />
                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
                    {proyecto.resumen}
                </Typography>

                {/* Información general */}
                <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", gap: 3 }} >
                    <Box sx={{ width: "70%", display: "flex", justifyContent: "space-between" }}>
                        <Grid2>
                            <Typography variant="body2" fontWeight="bold">
                                Fecha de Inicio:
                            </Typography>
                            <Chip
                                label={new Date(proyecto.fechaInicio).toLocaleDateString("es-CO")}
                                color="info"
                                size="small"
                            />
                        </Grid2>
                        <Grid2>
                            <Typography variant="body2" fontWeight="bold">
                                Fecha de Fin:
                            </Typography>
                            <Chip
                                label={new Date(proyecto.fechaFin).toLocaleDateString("es-CO")}
                                color="info"
                                size="small"
                            />
                        </Grid2>
                        <Grid2>
                            <Typography variant="body2" fontWeight="bold">
                                Tiempo de Ejecución:
                            </Typography>
                            <Chip
                                label={`${proyecto.tiempoEjecucion} meses`}
                                color="success"
                                size="small"
                            />
                        </Grid2>
                    </Box>

                    <Box>
                        {proyecto && proyecto.evaluador && proyecto.evaluador?.id ? (
                            <>
                                <Typography variant="body2" fontWeight="bold">
                                    Docente evaluador:
                                </Typography>
                                <Chip
                                    label={`${proyecto.evaluador.fullname} - ${proyecto.evaluador.email}`}
                                    color="default"
                                    sx={{ fontWeight: "bold", fontSize: "1rem", py: 1 }}
                                />
                            </>
                        ) : (
                            <>
                                <Button variant="contained" onClick={() => setOpenModal(true)}>
                                    Asignar Evaluador
                                </Button>

                                <AsignarEvaluadorModal
                                    proyectoId={proyecto?.id as string}
                                    open={openModal}
                                    onClose={() => setOpenModal(false)}
                                />
                            </>
                        )}
                    </Box>
                </Box >

                <Divider sx={{ my: 3 }} />

                {/* Sección de información específica por tipo de proyecto */}
                {
                    proyecto.proyectoAula && (
                        <>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Información del Proyecto de Aula
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText primary="Curso" secondary={proyecto.proyectoAula.curso} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Docente Orientador"
                                        secondary={proyecto.proyectoAula.docenteOrientador}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Estado de Formulación"
                                        secondary={proyecto.proyectoAula.estadoFormulacion}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Estado de Ejecución"
                                        secondary={proyecto.proyectoAula.estadoEjecucion}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Estado de Terminación"
                                        secondary={proyecto.proyectoAula.estadoTerminado}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Tipo de Proyecto"
                                        secondary={proyecto.proyectoAula.tipoProyecto}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Modalidad de Presentación"
                                        secondary={proyecto.proyectoAula.modalidadPresentacion}
                                    />
                                </ListItem>
                            </List>
                        </>
                    )
                }

                {
                    proyecto.proyectoSemillero && (
                        <>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Información del Proyecto de Semillero
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary="Nombre del Semillero"
                                        secondary={proyecto.proyectoSemillero.nombreSemillero}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Sigla del Semillero"
                                        secondary={proyecto.proyectoSemillero.siglaSemillero}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Director del Semillero"
                                        secondary={proyecto.proyectoSemillero.directorSemillero}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Modalidad de Presentación"
                                        secondary={proyecto.proyectoSemillero.modalidadPresentacion}
                                    />
                                </ListItem>
                            </List>
                        </>
                    )
                }

                <Box sx={{ width: "60%" }}>
                    <StudentTable estudiantes={proyecto.estudiantes} />
                </Box>

                <Divider sx={{ my: 3 }} />
                {proyecto?.documentoUrl ? (
                    <PdfViewer url={proyecto?.documentoUrl ?? ""} />
                ) : (
                    <Typography variant="body1">No hay documento disponible</Typography>
                )}
            </Paper >
        );
    }
}