"use client";

import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Convocatoria } from "@/modules/convocatorias/convocatoria-types";
import { Criterio } from "../rubrica-types";

interface RubricaConvocatoriaProps {
    convocatoria: Convocatoria;
}

const RubricaConvocatoria: React.FC<RubricaConvocatoriaProps> = ({ convocatoria }) => {
    const { rubrica } = convocatoria;

    if (!rubrica) {
        return (
            <Card sx={{ mt: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" color="error">
                        Esta convocatoria no tiene una rúbrica asociada.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ mt: 3, p: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Rúbrica: {rubrica.nombre}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    {rubrica.descripcion}
                </Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Criterios de Evaluación:
                </Typography>
                <List>
                    {rubrica.criterios.map((criterio: Criterio) => (
                        <React.Fragment key={criterio.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={`${criterio.nombre} (Puntaje: ${criterio.puntajeMin} - ${criterio.puntajeMax})`}
                                    secondary={criterio.descripcion}
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default RubricaConvocatoria;