"use client"; // 👈 Ahora es un Client Component

import { useEffect, useState } from "react";
import { Project } from "@/modules/projects/project-type";
import getProjects from "@/modules/projects/server/get-projects"; // Server Action
import ProjectsTable from "@/modules/projects/section/projects-table";
import { Box, CircularProgress } from "@mui/material";

export default function ProyectosTable() {
    const [proyectos, setProyectos] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getProjects(); // Llamada al Server Action
            setProyectos(data || []);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (proyectos.length > 0) {
        return (
            <ProjectsTable proyectos={proyectos} />
        )
    }

}