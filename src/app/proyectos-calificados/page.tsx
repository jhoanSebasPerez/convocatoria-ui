"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Chip,
    CircularProgress,
    Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import getProjectsCalificados, { ProyectoCalificado } from "@/modules/projects/server/get-proyectos-calificados";

export default function ProyectosCalificadospage() {
    const router = useRouter();

    const [proyectos, setProyectos] = useState<ProyectoCalificado[] | null>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getProjectsCalificados().then((data) => {
            setProyectos(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Proyectos Calificados
            </Typography>

            <Table>
                {/* ENCABEZADO */}
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Título</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Convocatoria</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Puntaje Final</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Fecha de Evaluación</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                    </TableRow>
                </TableHead>

                {/* CUERPO DE LA TABLA */}
                <TableBody>
                    {proyectos && proyectos.length > 0 ? (
                        proyectos.map((proyecto) => (
                            <TableRow key={proyecto.id}>
                                <TableCell>{proyecto.titulo}</TableCell>
                                <TableCell>{proyecto.convocatoria}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${proyecto.puntajeFinal} pts`}
                                        color={proyecto.puntajeFinal >= 50 ? "success" : "error"}
                                        sx={{ fontWeight: "bold" }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={dayjs(proyecto.fechaEvaluacion).format("DD-MM-YYYY")}
                                        color="primary"
                                        sx={{ fontWeight: "bold" }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => router.push(`/proyectos-calificados/${proyecto.id}`)}
                                    >
                                        Ver Detalle
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                No hay proyectos calificados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};