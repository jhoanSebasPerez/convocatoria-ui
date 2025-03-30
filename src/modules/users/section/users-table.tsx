import { Box, Chip, Divider, Grid2, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { User } from "../users-types";

interface UserTableProps {
    readonly usuarios: User[];
    readonly setSelectedUser: (user: User) => void;
}

export default function UsersTable({
    usuarios,
    setSelectedUser,
}: UserTableProps) {
    // 🔹 Definir columnas del DataGrid
    const columns: GridColDef[] = [
        { field: "fullname", headerName: "Nombre Completo", width: 280 },
        { field: "email", headerName: "Correo Electrónico", width: 280 },
        {
            field: "roles",
            headerName: "Rol",
            width: 160,
            renderCell: (params) => (
                <Chip
                    label={params.value[0]}
                    color={
                        params.value[0] === "ADMIN"
                            ? "primary"
                            : params.value[0] === "ESTUDIANTE"
                                ? "secondary"
                                : "default"
                    }
                    size="small"
                />
            ),
        },
    ];

    return (

        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Lista de Usuarios
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 400 }}>
                <DataGrid
                    rows={usuarios}
                    columns={columns}
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
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#e3f2fd", // Azul claro para diferenciar
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: "bold",
                        },
                    }}
                    onRowClick={(params) => setSelectedUser(params.row)}
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
        </Paper>
    );
}