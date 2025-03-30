import EstadoEvaluacionesChart from "@/modules/reportes/components/estado-evaluaciones-chart";
import DashboardChart from "@/modules/reportes/components/proyectos-por-convocatoria";
import ProyectosPorTipoChart from "@/modules/reportes/components/proyectos-por-tipo-chart";
import ResumenCards from "@/modules/reportes/components/resumen-cards";
import { Box, Typography } from "@mui/material";

export default function HomeAdmin() {
    return (
        <Box>
            <Typography variant="h1" sx={{ fontSize: "1.3rem", mb: 3 }}>Dashboard</Typography>
            <Box sx={{ mb: 2 }}>
                <ResumenCards />
            </Box>
            <DashboardChart />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}>
                <EstadoEvaluacionesChart />
                <ProyectosPorTipoChart />
            </Box>
        </Box>
    )
}