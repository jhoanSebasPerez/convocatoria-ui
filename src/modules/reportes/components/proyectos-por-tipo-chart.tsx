"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import getProyectosPorTipo from "../server/get-proyectos-por-tipo";

const COLORS = ["#0088FE", "#15854d"];

export default function ProyectosPorTipoChart() {

    const [data, setData] = useState<{ proyectosAula: number; proyectosSemillero: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProyectosPorTipo().then((res: any) => {
            setData(res);
            setLoading(false);
        });
    }, []);

    const chartData = [
        { name: "Proyectos de Aula", value: data?.proyectosAula ?? 0 },
        { name: "Proyectos de Semillero", value: data?.proyectosSemillero ?? 0 },
    ];

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ textAlign: "center", p: 2, width: "55%" }}>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
                Distribución de Proyectos
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
}