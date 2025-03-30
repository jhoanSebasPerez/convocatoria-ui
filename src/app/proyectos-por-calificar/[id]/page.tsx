"use client";

import { Project } from "@/modules/projects/project-type";
import getProjetById from "@/modules/projects/server/get-project-by-id";
import { Criterio, Rubrica } from "@/modules/rubricas/rubrica-types";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Convocatoria } from '../../../modules/convocatorias/convocatoria-types';
import { Box, Chip, CircularProgress, Snackbar, Typography } from "@mui/material";
import PdfViewer from "@/components/pdf-viewer";
import { Shield } from "@mui/icons-material";
import ProyectoEvaluacion from "@/modules/evaluaciones/components/evaluation-section";
import { Evaluacion } from "@/modules/evaluaciones/evaluacion-type";
import createEvaluacion from "@/modules/evaluaciones/server/create-evaluacion";

type ProyectoPorCalificarProps = {
    readonly params: Promise<{ id: string }>;
}

export default function ProyectoPorCalificarPage({ params }: ProyectoPorCalificarProps) {

    const { id } = use(params);

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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    const handleEvaluacion = async (evaluacion: Evaluacion) => {
        const response = await createEvaluacion(evaluacion);

        if (!response.error) {
            setShowToast(true);
            return;
        }

        setError("Error al guardar la evaluación para el proyecto");
    }

    return (
        <>
            <Box>
                <Box sx={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>{proyecto?.titulo}</Typography>
                        <Typography variant="h6">{convocatoria?.titulo}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Tipo de proyecto</Typography>
                        <Chip
                            label={proyecto?.tipoProyecto}
                            color={proyecto?.tipoProyecto === "AULA" ? "primary" : "secondary"}
                            sx={{ fontWeight: "bold" }}
                        />
                    </Box>
                </Box>
                <Box sx={{ marginBottom: 4 }}>
                    <Typography variant="body1">{proyecto?.resumen}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ width: '70%', marginRight: 4 }}>
                        <PdfViewer url={proyecto?.documentoUrl ?? ""} />
                    </Box>
                    <Box sx={{ width: "30%" }}>
                        <Typography variant="h6">Rúbrica: {rubrica?.nombre}</Typography>
                        <Typography variant="body2">{rubrica?.descripcion}</Typography>

                        {error && (
                            <Chip
                                icon={<Shield />}
                                label={error}
                                color="error"
                                sx={{ mt: 2 }}
                            />
                        )}

                        {proyecto && rubrica && criterios && (
                            <ProyectoEvaluacion proyecto={proyecto} rubrica={rubrica} criterios={criterios} onSubmit={handleEvaluacion} />
                        )}
                    </Box>
                </Box>
            </Box>
            <Snackbar
                open={showToast}
                autoHideDuration={6000}
                message="Se ha guardado la calificación para el proyecto"
            />
        </>
    );

}