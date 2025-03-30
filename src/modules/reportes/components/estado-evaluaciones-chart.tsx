"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import getEstadoProyecto from "../server/get-estado-proyectos";


const EstadoEvaluacionesChart = () => {
    const theme = useTheme();
    const [data, setData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEstadoProyecto().then((res: any) => {
            setData([
                { name: "Calificados", value: res.calificados },
                { name: "No Calificados", value: res.noCalificados }
            ]);
            setLoading(false);
        }
        );
    }, []);

    const COLORS = [theme.palette.primary.main, theme.palette.error.main];

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ textAlign: "center", p: 2, width: "45%" }}>
            <Typography variant="h6" fontWeight="bold">
                Estado de Evaluaciones de Proyectos
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill={theme.palette.primary.main}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default EstadoEvaluacionesChart;