"use client"

import { useEffect, useState } from "react";
import { Convocatoria } from "../convocatoria-types";
import getConvocatoriasAvailables from "../server/get-convocatorias-available";
import { Box, CircularProgress } from "@mui/material";
import ConvocatoriasSection from "../section/convocatorias-section";

export default function ConvocatoriasAvailable() {

    const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getConvocatoriasAvailables();
                if (data) {
                    setConvocatorias(data);
                }
            } catch (error) {
                console.error("Error fetching convocatorias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <ConvocatoriasSection convocatorias={convocatorias} />

        </Box>
    )
}