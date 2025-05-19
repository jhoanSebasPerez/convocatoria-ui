"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Grid, Slider, CircularProgress } from "@mui/material";
import { Criterio, Rubrica } from "@/modules/rubricas/rubrica-types";
import { Project } from "@/modules/projects/project-type";
import { Evaluacion } from "@/modules/evaluaciones/evaluacion-type";

interface EvaluacionProps {
    proyecto: Project;
    criterios: Criterio[];
    rubrica: Rubrica;
    onSubmit: (evaluacion: Evaluacion) => void;
}

const ProyectoEvaluacion: React.FC<EvaluacionProps> = ({ proyecto, criterios, onSubmit }) => {
    const [criteriosEvaluacion, setCriteriosEvaluacion] = useState(
        criterios.map((criterio) => ({
            criterioId: criterio.id as string,
            puntaje: criterio.puntajeMin,
            nombre: criterio.nombre,
            descripcion: criterio.descripcion,
            criterio: {
                nombre: criterio.nombre,
                descripcion: criterio.descripcion
            }
        })) || []
    );

    const [loading, setLoading] = useState(false);
    const [observaciones, setObservaciones] = useState("");

    // Cambiar el puntaje con el slider
    const handlePuntajeChange = (criterioId: string, value: number) => {
        setCriteriosEvaluacion((prev) =>
            prev.map((item) => (item.criterioId === criterioId ? { ...item, puntaje: value } : item))
        );
    };


    // Calcular el puntaje total
    const puntajeTotal = criteriosEvaluacion.reduce((sum, item) => sum + item.puntaje, 0);

    // Manejar envío de evaluación
    const handleSubmit = async () => {
        setLoading(true);
        const evaluacion: Evaluacion = {
            proyectoId: proyecto.id as string,
            puntajeTotal,
            observaciones,
            criteriosEvaluacion,
        };
        console.log("evaluación: ", evaluacion);
        onSubmit(evaluacion);
        setLoading(false);
    };

    return (
        <Paper sx={{ maxWidth: 800, margin: "auto", my: 4, py: 2 }}>
            <Box sx={{ mt: 0 }}>
                {criterios.map((criterio) => (
                    <Paper key={criterio.id} sx={{ pl: 2, my: 2 }}>
                        <Typography variant="h6" fontWeight="bold">{criterio.nombre}</Typography>
                        <Typography variant="body2" color="textSecondary">{criterio.descripcion}</Typography>

                        <Grid container spacing={2} alignItems="center" sx={{ mt: 2, px: 2 }}>
                            <Grid item xs={10}>
                                <Slider
                                    value={criteriosEvaluacion.find((c) => c.criterioId === criterio.id)?.puntaje || criterio.puntajeMin}
                                    onChange={(e, value) => handlePuntajeChange(criterio.id as string, value as number)}
                                    min={criterio.puntajeMin}
                                    max={criterio.puntajeMax}
                                    valueLabelDisplay="auto"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    {criteriosEvaluacion.find((c) => c.criterioId === criterio.id)?.puntaje || criterio.puntajeMin}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Box>

            {/* Observaciones generales */}
            <TextField
                fullWidth
                placeholder="Observaciones generales"
                variant="outlined"
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                sx={{ mt: 3, px: 2 }}
            />

            {/* Puntaje total */}
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, px: 3 }}>
                Puntaje Total: {puntajeTotal}
            </Typography>

            {/* Botón de enviar evaluación */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ mt: 2, mx: 3, width: "90%", py: 1 }}
                fullWidth
            >
                {loading ? <CircularProgress size={20} sx={{ mr: 1, color: "white" }} /> : "Calificar proyecto"}
            </Button>
        </Paper>
    );
};

export default ProyectoEvaluacion;