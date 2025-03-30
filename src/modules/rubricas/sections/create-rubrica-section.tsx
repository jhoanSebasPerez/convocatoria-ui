"use client"

import { Box, Button, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, OutlinedInput, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Add, Delete } from "@mui/icons-material";
import { Criterio, Rubrica } from "../rubrica-types";
import { useRubricaStore } from "../rubrica-store";
import CriterioDropdown from "../components/criterio-dropdown";
import { v4 as uuid } from 'uuid';


export default function CreateRubricaSection() {

    const { createRubrica, error, addNewCriterion, criteriosToAdding, deleteCriterion } = useRubricaStore();

    const [rubrica, setRubrica] = useState<Rubrica>({
        nombre: "",
        descripcion: "",
        criterios: [],
    });

    const [nuevoCriterio, setNuevoCriterio] = useState<Criterio>({
        nombre: "",
        puntajeMax: 0,
        puntajeMin: 0,
        descripcion: "",
    });

    const handleCriterioChange = (e: any) => {
        const { name, value } = e.target;
        setNuevoCriterio((prev) => ({ ...prev, [name]: value }));
    };

    const agregarCriterio = () => {
        if (
            nuevoCriterio.nombre.trim() &&
            nuevoCriterio.puntajeMax &&
            nuevoCriterio.puntajeMin &&
            nuevoCriterio.descripcion.trim()
        ) {
            nuevoCriterio.puntajeMin = parseInt(nuevoCriterio.puntajeMin.toString());
            nuevoCriterio.puntajeMax = parseInt(nuevoCriterio.puntajeMax.toString());
            addNewCriterion(nuevoCriterio);
            setRubrica((prev: any) => ({
                ...prev,
                criterios: [...prev.criterios, nuevoCriterio],
            }));
            setNuevoCriterio({
                nombre: "",
                puntajeMax: 0,
                puntajeMin: 0,
                descripcion: "",
            });
        }
    };

    const handleCreateRubrica = async (e: any) => {
        e.preventDefault();
        await createRubrica(rubrica);
        if (!error) {
            // Limpiar campos
            setRubrica({
                nombre: "",
                descripcion: "",
                criterios: [],
            });
        }
    }



    return (
        <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }} elevation={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Crear Rúbrica
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box onSubmit={handleCreateRubrica} component="form" method="POST" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Campos de la rúbrica */}
                <OutlinedInput
                    placeholder="Nombre de la rúbrica"
                    name="nombre"
                    value={rubrica.nombre}
                    onChange={(e) => setRubrica({ ...rubrica, nombre: e.target.value })}
                    fullWidth
                    required
                />
                <OutlinedInput
                    placeholder="Descripción"
                    name="descripcion"
                    value={rubrica.descripcion}
                    onChange={(e) => setRubrica({ ...rubrica, descripcion: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    required
                />

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Criterios</Typography>
                <CriterioDropdown />

                {/* Agregar criterios */}
                <Typography variant="h6">Agregar Criterios</Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <OutlinedInput
                        placeholder="Nombre del Criterio"
                        name="nombre"
                        value={nuevoCriterio.nombre}
                        onChange={handleCriterioChange}
                        sx={{ flex: 1 }}
                    />
                    <OutlinedInput
                        placeholder="Puntaje Mínimo"
                        name="puntajeMin"
                        type="number"
                        value={nuevoCriterio.puntajeMin}
                        onChange={handleCriterioChange}
                        sx={{ width: 100 }}
                    />
                    <OutlinedInput
                        placeholder="Puntaje Máximo"
                        name="puntajeMax"
                        type="number"
                        value={nuevoCriterio.puntajeMax}
                        onChange={handleCriterioChange}
                        sx={{ width: 100 }}
                    />
                    <OutlinedInput
                        placeholder="Descripción"
                        name="descripcion"
                        value={nuevoCriterio.descripcion}
                        onChange={handleCriterioChange}
                        fullWidth
                        multiline
                        rows={2}
                    />
                </Box>

                <Button variant="contained" onClick={agregarCriterio} startIcon={<Add />} sx={{ alignSelf: "flex-start", paddingTop: 0, paddingBottom: 0, fontSize: "0.78rem" }}>
                    Agregar Criterio
                </Button>

                {/* Listado de criterios */}
                {criteriosToAdding.length > 0 && (
                    <List>
                        {criteriosToAdding.map((criterio: Criterio) => (
                            <ListItem key={criterio.id}>
                                <ListItemText
                                    primary={criterio.nombre}
                                    secondary={`Puntaje: ${criterio.puntajeMin} - ${criterio.puntajeMax}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => deleteCriterion(criterio.id ?? uuid())} color="error">
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                )}

                <Divider sx={{ my: 2 }} />

                <Button
                    type="submit"
                    disabled={criteriosToAdding.length === 0}
                    variant="contained"
                    fullWidth
                    sx={{
                        "&.Mui-disabled": {
                            backgroundColor: "grey.400 !important", // 🔹 Usa `!important` para forzar el color
                            color: "white !important",
                            cursor: "not-allowed",
                            opacity: 0.7, // 🔹 Reduce opacidad para indicar que está deshabilitado
                        },
                        backgroundColor: criteriosToAdding.length === 0 ? "grey.400" : "primary",
                        color: "white",
                        "&:hover": {
                            backgroundColor: criteriosToAdding.length === 0 ? "grey.400" : "black",
                        },
                    }}
                >
                    Guardar Rúbrica
                </Button>
            </Box>
        </Paper>
    );
}