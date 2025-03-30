"use client";

import { Button, Grid2 } from "@mui/material";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { Convocatoria } from "../convocatoria-types";
import { useAuthStore } from "@/modules/auth/auth-store";
import { idID } from "@mui/material/locale";

interface ConvocatoriasSectionProps {
    readonly convocatorias: Convocatoria[];
}

export default function ConvocatoriasSection({
    convocatorias
}: ConvocatoriasSectionProps) {
    const { user } = useAuthStore();
    const router = useRouter();

    const role = user?.roles[0];

    // 🔹 Definir las columnas para el DataGrid
    const columns: GridColDef[] = [
        ...(role !== "ESTUDIANTE"
            ? [{ field: "id", headerName: "ID", flex: 1 }] // 🔹 Se adapta dinámicamente
            : []),
        { field: "titulo", headerName: "Título", flex: 2 }, // 🔹 Más espacio para el título
        { field: "descripcion", headerName: "Descripción", flex: 3 },
        { field: "fechaInicio", headerName: "Fecha de Inicio", flex: 1 },
        { field: "fechaFin", headerName: "Fecha de Fin", flex: 1 },
        {
            field: "isActive",
            headerName: "Estado",
            flex: 1, // 🔹 Responsivo
            renderCell: (params) => (
                <span style={{ color: params.value ? "green" : "red", fontWeight: "bold" }}>
                    {params.value ? "Activa" : "Inactiva"}
                </span>
            )
        },
        ...(role === "ESTUDIANTE"
            ? [{
                field: "acciones",
                headerName: "Acciones",
                flex: 1.5, // 🔹 Botón con tamaño adaptable
                renderCell: (params: any) => (
                    <Button
                        variant="outlined"
                        onClick={() => {
                            const formatTitle = params.row.titulo.toLowerCase().replace(/ /g, "-");
                            router.push(`postulacion/convocatoria/${params.id}`);
                        }}
                    >
                        Postularse
                    </Button>
                )
            }]
            : [])
    ];

    const rows = convocatorias.map((convocatoria) => {
        const baseRow = {
            id: convocatoria.id,
            titulo: convocatoria.titulo,
            descripcion: convocatoria.descripcion,
            fechaInicio: new Date(convocatoria.fechaInicio).toLocaleDateString("es-CO"),
            fechaFin: new Date(convocatoria.fechaFin).toLocaleDateString("es-CO"),
            isActive: convocatoria.isActive ?? false,
        };

        return baseRow;
    });

    // 🔹 Función para manejar el clic en la fila
    const handleRowClick: GridEventListener<"rowClick"> = (params) => {
        if (role == "ESTUDIANTE") return;
        router.push(`/convocatorias/${params.id}`);
    };

    return (
        <Grid2 size={{ xs: 12, lg: 9 }}>
            <DataGrid
                getRowId={(row) => row.id ?? `${row.titulo}-${row.fechaInicio}`}
                rows={rows}
                columns={columns}
                rowHeight={80}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                }
                initialState={{
                    pagination: { paginationModel: { pageSize: 20 } },
                }}
                pageSizeOptions={[10, 20, 50]}
                disableColumnResize

                density="compact"
                sx={{
                    cursor: "pointer",
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                    },
                    '.MuiDataGrid-cell:focus': {
                        outline: 'none' // Elimina el borde azul en celdas
                    },
                    '.MuiDataGrid-row:focus': {
                        outline: 'none' // Elimina el borde azul en filas
                    },
                    '.MuiDataGrid-cell:focus-within': {
                        outline: 'none' // Evita que la celda se resalte al hacer clic en un botón dentro de ella
                    }
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
        </Grid2>
    );
}