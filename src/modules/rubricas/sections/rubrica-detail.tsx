"use client";

import { Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useRubricaStore } from "../rubrica-store";

export default function RubricaDetail() {
    const { selectedRubrica, } = useRubricaStore();

    if (!selectedRubrica) {
        return <Typography variant="h6">Seleccione una rúbrica</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                {selectedRubrica.nombre}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
                {selectedRubrica.descripcion}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="button" fontWeight="bold" sx={{ mb: 3 }} gutterBottom>
                Criterios de Evaluación
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>Criterio</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }} align="center">Puntaje Mín.</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }} align="center">Puntaje Máx.</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedRubrica.criterios.map((criterio) => (
                            <TableRow key={criterio.id}>
                                <TableCell>{criterio.nombre}</TableCell>
                                <TableCell align="center">{criterio.puntajeMin}</TableCell>
                                <TableCell align="center">{criterio.puntajeMax}</TableCell>
                                <TableCell>{criterio.descripcion}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}