"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import getProjectById from '@/modules/projects/server/get-project-by-id';
import { Project } from "@/modules/projects/project-type";
import { Evaluacion } from "@/modules/evaluaciones/evaluacion-type";
import getEvaluacionPorProyecto from "@/modules/projects/server/get-evaluacion-projecto";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import PdfViewer from "@/components/pdf-viewer";
import EvaluacionDetalle from "@/modules/evaluaciones/components/evaluacion-detalle";

export default function EvaluacionPorProyecto() {

    const { id }: { id: string } = useParams();

    const [project, setProject] = useState<Project | null>(null);
    const [evaluacion, setEvaluacion] = useState<Evaluacion | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getProjectById(id).then((project) => {
            setProject(project);
        });

        getEvaluacionPorProyecto(id).then((evaluacion) => {
            setEvaluacion(evaluacion);
        });

        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!loading && !project) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <Typography variant="h6">Proyecto no encontrado</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800 }}>{project?.titulo}</Typography>
                    {project?.convocatoria && (
                        <Typography variant="h6">{project.convocatoria.titulo}</Typography>
                    )}
                </Box>
                <Box>
                    <Typography variant="h6">Tipo de proyecto</Typography>
                    <Chip
                        label={project?.tipoProyecto}
                        color={project?.tipoProyecto === "AULA" ? "primary" : "secondary"}
                        sx={{ fontWeight: "bold" }}
                    />
                </Box>
            </Box>
            <Box sx={{ marginBottom: 4 }}>
                <Typography variant="body1">{project?.resumen}</Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '70%', marginRight: 4 }}>
                    <PdfViewer url={project?.documentoUrl ?? ""} />
                </Box>
                <Box sx={{ width: "30%" }}>
                    <Typography variant="h6">Rúbrica: {evaluacion?.rubrica?.nombre}</Typography>
                    <Typography variant="body2">{evaluacion?.rubrica?.descripcion}</Typography>

                    {evaluacion && (
                        <EvaluacionDetalle evaluacion={evaluacion} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}