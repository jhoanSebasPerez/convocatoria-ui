"use client";

import React from "react";
import {
    Box,
    Typography,
    Paper,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { Evaluacion } from "../evaluacion-type";


interface Props {
    evaluacion: Evaluacion;
}

const EvaluacionDetalle: React.FC<Props> = ({ evaluacion }) => {

    return (
        <Paper elevation={3} sx={{ padding: 2, maxWidth: 900, margin: "auto", mt: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Detalles de la Evaluación
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                {/* Puntaje Total */}
                <Box>
                    <Typography variant="h6">Puntaje Total:</Typography>
                    <Chip
                        label={`${evaluacion.puntajeTotal} pts`}
                        color={evaluacion.puntajeTotal >= 50 ? "success" : "error"}
                        sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    />
                </Box>

                {/* Fecha Evaluación */}
                <Box>
                    <Typography variant="h6">Fecha de Evaluación:</Typography>
                    <Chip
                        label={dayjs(evaluacion.fechaEvaluacion).format("DD-MM-YYYY")}
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                    />
                </Box>
            </Box>

            {/* Observaciones */}
            {evaluacion.observaciones && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Observaciones:</Typography>
                    <Typography variant="body1">{evaluacion.observaciones}</Typography>
                </Box>
            )}

            {/* Tabla de Criterios Evaluados */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Criterios Evaluados
            </Typography>
            <TableContainer sx={{ marginLeft: 0 }} component={Paper}>
                <Table >
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>Criterio</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Puntaje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {evaluacion.criteriosEvaluacion.map((criterio) => (
                            <TableRow key={criterio.id}>
                                <TableCell>{criterio.nombre || `Criterio ID: ${criterio.criterioId}`}</TableCell>
                                <TableCell>{criterio.descripcion}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${criterio.puntaje} pts`}
                                        color="secondary"
                                        sx={{ fontWeight: "bold" }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default EvaluacionDetalle;