"use client";

import { useEffect, useState } from "react";
import { User } from "../users-types";
import getUsers from "../server/get-users";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import UsersTable from "../section/users-table";
import UserDetail from "../section/user-detail";
import AddDocenteModal from "../section/agregar-docente-modal";

export default function UsersView() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getUsers();
                if (data) {
                    setUsers(data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showModal]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Gestión de Usuarios
                </Typography>
                <Button variant="contained" onClick={() => setShowModal(true)}>Agregar Docente</Button>
            </Box>
            <Box sx={{ width: "100%", display: "flex", gap: 2 }} >
                <Box sx={{ width: "65%" }}>
                    <UsersTable usuarios={users} setSelectedUser={setSelectedUser} />
                </Box>
                <Box sx={{ width: "35%" }}>
                    <UserDetail selectedUser={selectedUser} />
                </Box>
            </Box >
            <AddDocenteModal showModal={showModal} setShowModal={setShowModal} />
        </>
    );
}