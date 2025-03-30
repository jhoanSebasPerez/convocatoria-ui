"use client";

import { Box, Button, CircularProgress } from "@mui/material";
import ConvocatoriasSection from "../section/convocatorias-section";
import { useEffect, useState } from "react";
import getConvocatorias from "../server/get-convocatorias";
import { Convocatoria } from "../convocatoria-types";
import { useRouter } from "next/navigation";

export default function ConvocatoriasView() {

    const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getConvocatorias();
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
        <>
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
                <Button variant="contained" color="primary" onClick={() => router.push('/convocatorias/crear-convocatoria')}>
                    Crear convocatoria
                </Button>
            </Box>
            <Box sx={{ height: 20 }} />
            <ConvocatoriasSection convocatorias={convocatorias} />
        </>

    );
}