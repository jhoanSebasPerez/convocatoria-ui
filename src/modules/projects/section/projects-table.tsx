import { Box, Chip, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { Project } from "../project-type";

interface ProjectsTableProps {
    readonly proyectos: Project[];
}

export default function ProjectsTable({ proyectos }: ProjectsTableProps) {
    console.log("proyectos", proyectos);

    const router = useRouter();

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", flex: 1 }, // 🔹 Ajuste dinámico
        { field: "titulo", headerName: "Título", flex: 2 }, // 🔹 Más espacio para títulos largos
        {
            field: "resumen",
            headerName: "Resumen",
            flex: 3, // 🔹 Se ajusta automáticamente
            renderCell: (params) => (
                <Typography sx={{ p: 2 }}>
                    {params.value.length > 50 ? `${params.value.substring(0, 50)}...` : params.value}
                </Typography>
            ),
        },
        { field: "convocatoria", headerName: "Convocatoria", flex: 2 },
        {
            field: "evaluador",
            headerName: "Evaluador",
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === "Asignado" ? "success" : "info"}
                    size="small"
                />
            ),
        },
        {
            field: "tipoProyecto",
            headerName: "Tipo de Proyecto",
            flex: 1.5, // 🔹 Espacio adecuado para el chip
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === "Aula"
                            ? "primary"
                            : params.value === "Semillero"
                                ? "secondary"
                                : "default"
                    }
                    size="small"
                />
            ),
        },
    ];

    const handleRowClick: GridEventListener<"rowClick"> = (params) => {
        router.push(`/proyectos/${params.id}`);
    };

    return (
        <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Lista de Proyectos
            </Typography>
            <Box sx={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rowHeight={80}
                    rows={proyectos}
                    columns={columns}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                    }
                    initialState={{
                        pagination: { paginationModel: { pageSize: 20 } },
                    }}
                    pageSizeOptions={[10, 20, 50]}

                    density="compact"
                    sx={{
                        cursor: "pointer",
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#e3f2fd", // Azul claro para diferenciar
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: "bold",
                        },
                    }}
                    onRowClick={handleRowClick} // Maneja el clic en toda la fila
                    slotProps={{
                        filterPanel: {
                            filterFormProps: {
                                logicOperatorInputProps: {
                                    variant: "outlined",
                                    size: "small",
                                },
                                columnInputProps: {
                                    variant: "outlined",
                                    size: "small",
                                    sx: { mt: "auto" },
                                },
                                operatorInputProps: {
                                    variant: "outlined",
                                    size: "small",
                                    sx: { mt: "auto" },
                                },
                                valueInputProps: {
                                    InputComponentProps: {
                                        variant: "outlined",
                                        size: "small",
                                    },
                                },
                            },
                        },
                    }}
                />
            </Box>
        </>
    );
}