"use client";

import * as React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useRouter } from "next/navigation";
import { API_URL } from "@/common/constants/api";
import { Box, List, ListItem, ListItemText, Paper } from "@mui/material";

interface Result {
    id: string;
    titulo: string;
    tipoProyecto: string | undefined;
    tipo?: string;
}

export default function Search() {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<Result[]>([]);
    const router = useRouter();

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);

        if (value.length > 1) {
            const response = await fetch(`${API_URL}/search?q=${value}`);
            const data = await response.json();
            setResults(data);
        } else {
            setResults([]);
        }
    };

    const handleSelect = (id: string, tipo: string) => {
        const path = tipo === "Convocatoria" ? `/convocatorias/${id}` : `/proyectos/${id}`;
        setQuery("");
        setResults([]);
        router.push(path);
    };

    return (
        <Box sx={{ width: { xs: "100%", md: "25ch", lg: "300px" }, position: "relative" }}>
            <OutlinedInput
                size="small"
                id="search"
                value={query}
                onChange={handleSearch}
                placeholder="Search…"
                sx={{ width: "100%" }}
                startAdornment={
                    <InputAdornment position="start" sx={{ color: "text.primary" }}>
                        <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                }
                inputProps={{
                    "aria-label": "search",
                }}
            />
            {results.length > 0 && (
                <Paper
                    sx={{
                        cursor: "pointer",
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%", // 🔹 Se ajusta al ancho del campo de búsqueda
                        zIndex: 10,
                        mt: 1, // 🔹 Pequeño margen superior
                        boxShadow: 3, // 🔹 Sombra para mejor visualización
                        borderRadius: 1,
                    }}
                >
                    <List>
                        {results.map((item, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    width: "100%",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "action.hover" },
                                }}
                                onClick={() => handleSelect(item.id, item.tipoProyecto ?? item.tipo ?? "")}
                            >
                                <ListItemText
                                    primary={item.titulo}
                                    secondary={item.tipoProyecto ?? item.tipo}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}