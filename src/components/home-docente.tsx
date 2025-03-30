"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
} from "@mui/material";
import getProjectsPorCalificar from "@/modules/projects/server/get-projects-por-calificar";
import { CheckBox } from "@mui/icons-material";

const HomeDocente: React.FC = () => {
    const [proyectos, setProyectos] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        getProjectsPorCalificar().then((data: any) => {
            setProyectos(data);
        }
        );
    }, []);


    return (
        <TableContainer component={Paper} sx={{ mt: 4, p: 4 }}>
            <Table sx={{ borderRadius: "10px" }}>
                {/* ✅ ENCABEZADO CON ESTILO DIFERENCIADO */}
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Título</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Convocatoria</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Documento</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Calificado</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {proyectos.length > 0 ? (
                        proyectos.map((proyecto) => (
                            <TableRow key={proyecto.id}>
                                <TableCell>{proyecto.titulo}</TableCell>
                                <TableCell>{proyecto.convocatoria}</TableCell>

                                {/* ✅ BADGE PARA TIPO DE PROYECTO */}
                                <TableCell>
                                    <Chip
                                        label={proyecto.tipoProyecto}
                                        color={proyecto.tipoProyecto === "AULA" ? "primary" : "secondary"}
                                        sx={{ fontWeight: "bold" }}
                                    />
                                </TableCell>

                                <TableCell>{proyecto.documentoUrl ? "📄 Sí" : "❌ No"}</TableCell>
                                <TableCell>{proyecto.haSidoCalificado ? "✅ Sí" : "⏳ No"}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<CheckBox />}
                                        onClick={() => router.push(`/proyectos-por-calificar/${proyecto.id}`)}
                                    >
                                        Calificar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                No hay proyectos disponibles.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default HomeDocente;