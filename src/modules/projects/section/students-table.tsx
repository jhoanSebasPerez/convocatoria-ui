"use client"

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Student } from "../project-type";
import { Box, Typography } from "@mui/material";

interface EstudiantesGridProps {
    readonly estudiantes: Student[];
}

export default function StudentTable({ estudiantes }: EstudiantesGridProps) {
    // Definir las columnas del DataGrid
    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 200 },
        { field: "fullname", headerName: "Nombre completo", width: 200 },
        { field: "email", headerName: "Correo Electrónico", width: 250 }
    ];

    return (
        <>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Estudiantes Inscritos en el Proyecto
            </Typography>
            <Box sx={{ height: "auto", width: "100%" }}>
                {estudiantes.length > 0 ? (
                    <DataGrid
                        rows={estudiantes.map((estudiante) => ({
                            id: estudiante.id,
                            fullname: estudiante.fullname,
                            email: estudiante.email,
                        }))}
                        columns={columns}
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        sx={{
                            cursor: "pointer",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#e3f2fd", // Azul claro para diferenciar
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: "bold",
                            },
                        }}
                        disableColumnResize
                        density="compact"
                    />
                ) : (
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                        No hay estudiantes inscritos en el proyecto.
                    </Typography>
                )}
            </Box>
        </>
    );
}