"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material";
import getProyectosPorConvocatoria, { ProyectoPorConvocatoria } from "../server/get-proyectos-por-convocatoria";

export default function ProyectosPorCategoriaGraph() {
    const [data, setData] = useState<ProyectoPorConvocatoria[] | null>([]);
    const theme = useTheme();

    useEffect(() => {
        getProyectosPorConvocatoria().then((res) => {
            setData(res);
        });
    }, []);

    return (
        <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: "background.paper" }}>
            <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
                Proyectos por Convocatoria
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="name" stroke={theme.palette.text.primary} />
                    <YAxis stroke={theme.palette.text.primary} />
                    <Tooltip contentStyle={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }} />
                    <Bar dataKey="value" fill={theme.palette.primary.main} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
}