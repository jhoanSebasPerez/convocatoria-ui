"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { Project } from "../project-type";


interface ProyectoTableProps {
    readonly proyectos: Project[];
}

export default function ProjectsTableByConvocatoria({ proyectos }: ProyectoTableProps) {
    const router = useRouter();

    const columns: GridColDef[] = [
        { field: "titulo", headerName: "Título", width: 230, headerClassName: "header-style" },
        { field: "resumen", headerName: "Resumen", width: 300, headerClassName: "header-style" },
        { field: "tiempoEjecucion", headerName: "Tiempo (meses)", width: 150, headerClassName: "header-style" },
        { field: "fechaInicio", headerName: "Inicio", width: 120, headerClassName: "header-style" },
        { field: "fechaFin", headerName: "Fin", width: 120, headerClassName: "header-style" },
        {
            field: "tipoProyecto",
            headerName: "Tipo de proyecto",
            width: 180,
            headerClassName: "header-style",
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === "Aula" ? "primary" : params.value === "Semillero" ? "secondary" : "default"}
                    size="small"
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                />
            ),
        },
    ];

    const rows = proyectos.map((proyecto) => ({
        id: proyecto.id,
        titulo: proyecto.titulo,
        resumen: proyecto.resumen,
        tiempoEjecucion: proyecto.tiempoEjecucion,
        fechaInicio: new Date(proyecto.fechaInicio).toLocaleDateString("es-CO"),
        fechaFin: new Date(proyecto.fechaFin).toLocaleDateString("es-CO"),
        tipoProyecto: proyecto.tipoProyecto,
    }));

    return (
        <Box
            sx={{
                width: "100%",
                "& .MuiDataGrid-root": {
                    borderRadius: 2,
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#1e293b !important", // 🔹 Fondo oscuro
                    color: "white !important", // 🔹 Texto blanco
                    fontWeight: "bold",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    color: "white !important",
                    fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                    padding: "10px",
                },
                "& .MuiDataGrid-columnSeparator": {
                    display: "none", // 🔹 Ocultar separadores de columnas
                },
                "& .header-style": {
                    backgroundColor: "#334155 !important", // 🔹 Azul oscuro
                    color: "#F8FAFC !important", // 🔹 Blanco claro
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                onRowClick={(params) => router.push(`/proyectos/${params.id}`)}
                autoHeight
                sx={{
                    cursor: "pointer",
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#e3f2fd", // Azul claro para diferenciar
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                    },
                }}
            />
        </Box>
    );
}