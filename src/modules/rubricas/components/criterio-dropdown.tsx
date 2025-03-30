"use client";

import React, { useState, useEffect } from "react";
import {
    TextField,
    Autocomplete,
    CircularProgress,
    MenuItem,
    Paper
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { useRubricaStore } from "../rubrica-store";

export default function CriterioDropdown() {
    const [query, setQuery] = useState("");
    const { loading, fetchCriterios, criterios, selectedCriterio, selectCriterio } = useRubricaStore();

    useEffect(() => {
        fetchCriterios(query);
    }, [query]);

    return (
        <Autocomplete
            options={criterios}
            getOptionLabel={(option) => option.nombre || ""}
            value={selectedCriterio ?? undefined}
            onChange={(_, newValue) => {
                selectCriterio(newValue?.id ?? "");
                setQuery("");
            }}
            inputValue={query}
            onInputChange={(_, newValue) => setQuery(newValue)}
            loading={loading}
            fullWidth
            disableClearable
            popupIcon={
                <ExpandMoreRoundedIcon
                    sx={{
                        color: "#1976d2",
                        fontSize: "1.6rem",
                        pointerEvents: "none",
                        border: "none",
                    }}
                />
            }
            sx={{
                "& .MuiAutocomplete-inputRoot": {
                    borderRadius: 2,
                    padding: "10px 14px",
                    backgroundColor: "#fff",
                },
                "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fafafa",
                    borderRadius: "8px",
                    border: "1px solid #d1d1d1",
                    transition: "all 0.3s ease",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "#1976d2" },
                    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                },
                "& .MuiAutocomplete-popupIndicator": {
                    background: "none !important",
                    border: "none !important",
                    boxShadow: "none !important",
                    padding: "0px !important",
                    minWidth: "auto !important",
                    "&:hover": { background: "none" },
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Seleccionar Criterio"
                    size="small"
                    InputProps={{
                        ...params.InputProps,
                        sx: { paddingRight: "40px" },
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress
                                        color="primary"
                                        size={20}
                                        sx={{ mr: 2 }}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => (
                <MenuItem
                    {...props}
                    key={option.id}
                    sx={{
                        fontSize: "0.95rem",
                        padding: "10px 16px",
                        "&:hover": { backgroundColor: "#f0f8ff" }, // 🔹 Hover Azul Suave
                    }}
                >
                    {option.nombre}
                </MenuItem>
            )}
            PaperComponent={(props) => (
                <Paper
                    {...props}
                    elevation={4}
                    sx={{
                        borderRadius: 2,
                        boxShadow: "0px 3px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    {props.children}
                </Paper>
            )}
        />
    );
}