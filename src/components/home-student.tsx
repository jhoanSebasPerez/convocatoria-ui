import ConvocatoriasAvailable from "@/modules/convocatorias/views/convocatorias-available";
import { Box } from "@mui/material";

export default function HomeStudent() {
    return (
        <Box>
            <h1 className="text-2xl font-bold mb-6">Convocatorias Disponibles</h1>
            <ConvocatoriasAvailable />
        </Box>
    )
}