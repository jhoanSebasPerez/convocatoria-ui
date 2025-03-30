"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import ForgotPassword from "../components/forgot-password";
import login from "../server/login";
import { Divider, Typography } from "@mui/material";
import NextLink from "next/link";

export default function SignIn() {
    const [state, formAction] = React.useActionState(login, { error: "" });
    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            >
                Sign In
            </Typography>
            <form action={formAction}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="email">Correo Electrónico</FormLabel>
                        <TextField
                            error={!!state.error}
                            helperText={state.error}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="email@ufps.edu.co"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={state.error ? "error" : "primary"}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Contraseña</FormLabel>
                        <TextField
                            error={!!state.error}
                            helperText={state.error}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            required
                            fullWidth
                            variant="outlined"
                            color={state.error ? "error" : "primary"}
                        />
                    </FormControl>

                    <ForgotPassword open={open} handleClose={handleClose} />
                    <Button type="submit" fullWidth variant="contained">
                        Iniciar Sesión
                    </Button>
                    <Link
                        component="button"
                        type="button"
                        onClick={handleClickOpen}
                        variant="body2"
                        sx={{ alignSelf: "center" }}
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </Box>
            </form>
            <Divider>o</Divider>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography sx={{ textAlign: "center" }}>
                    ¿No tienes una cuenta?{" "}
                    <Link component={NextLink} href="/auth/signup" variant="body2">
                        Regístrate
                    </Link>
                </Typography>
            </Box>
        </>
    );
}