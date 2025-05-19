"use client";

import { useState } from "react";
import { Box, Button, Typography, Paper, Stack, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { API_URL } from "@/common/constants/api";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function GenerarReporte() {
  const [fechaInicio, setFechaInicio] = useState<any>(null);
  const [fechaFin, setFechaFin] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Por favor seleccione ambas fechas");
      return;
    }

    if (fechaInicio.isAfter(fechaFin)) {
      setError("La fecha de inicio debe ser anterior a la fecha fin");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Formatear fechas como YYYY-MM-DD
      const formatearFecha = (fecha: any) => {
        return fecha.format('YYYY-MM-DD');
      };

      const response = await axios.post(
        `${API_URL}/reportes/generar-pdf`,
        {
          fechaInicio: formatearFecha(fechaInicio),
          fechaFin: formatearFecha(fechaFin),
        },
        {
          responseType: "blob",
        }
      );

      // Crear URL para el blob y forzar descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_${formatearFecha(fechaInicio)}_${formatearFecha(fechaFin)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Error al generar reporte:", error);
      setError("Error al generar el reporte. Intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: "linear-gradient(to right, #f5f7fa, #ffffff)"
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PictureAsPdfIcon color="error" />
          Generar Reporte PDF
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Seleccione un rango de fechas para generar un reporte detallado de proyectos
        </Typography>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <DatePicker
            label="Fecha inicio"
            value={fechaInicio}
            onChange={(newValue) => setFechaInicio(newValue)}
            sx={{ flexGrow: 1 }}
          />
          <DatePicker
            label="Fecha fin"
            value={fechaFin}
            onChange={(newValue) => setFechaFin(newValue)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerarReporte}
            disabled={loading || !fechaInicio || !fechaFin}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdfIcon />}
            sx={{
              minWidth: { xs: "100%", sm: "auto" },
              py: 1.5,
              backgroundColor: "#3f51b5",
              "&:hover": {
                backgroundColor: "#303f9f"
              }
            }}
          >
            {loading ? "Generando..." : "Generar PDF"}
          </Button>
        </Stack>
      </LocalizationProvider>

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
}
