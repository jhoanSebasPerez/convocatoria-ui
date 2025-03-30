"use client";

import CrearConvocatoriaView from "@/modules/convocatorias/views/create-convocatoria-view";
import { useRubricaStore } from "@/modules/rubricas/rubrica-store";
import CreateRubricaSection from "@/modules/rubricas/sections/create-rubrica-section";
import RubricaDetail from "@/modules/rubricas/sections/rubrica-detail";
import { Box } from "@mui/material";
import { useEffect } from "react";

export default function CrearConvocatoriaPage() {

    const { selectedRubrica, clearSelectedRubrica, showCreateRubricaDialog, toggleShowCreateRubrica } = useRubricaStore();

    useEffect(() => {
        return () => {
            clearSelectedRubrica();
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', gap: 3 }}>
            <CrearConvocatoriaView sx={{ width: "60%" }} setShowCreateRubrica={toggleShowCreateRubrica} />
            <Box sx={{ width: "40%" }}>
                {
                    selectedRubrica && (
                        <RubricaDetail />
                    )
                }{
                    showCreateRubricaDialog && (
                        <CreateRubricaSection />
                    )
                }
            </Box>
        </Box>
    );
}