
"use client"

import HomeAdmin from "@/components/home-admin";
import HomeDocente from "@/components/home-docente";
import HomeStudent from "@/components/home-student";
import { useAuthStore } from "@/modules/auth/auth-store";
import { Box, CircularProgress } from "@mui/material";


export default function Home() {
  const { user, loading } = useAuthStore();

  const role = user?.roles[0];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (role === "ADMIN") {
    return (
      <HomeAdmin />
    );
  }

  if (role === "ESTUDIANTE") {
    return (
      <HomeStudent />
    );
  }

  if (role === "DOCENTE") {
    return (
      <Box>
        <h1 className="text-2xl font-bold mb-6">Proyectos por calificar</h1>
        <HomeDocente />
      </Box>
    );
  }
}
