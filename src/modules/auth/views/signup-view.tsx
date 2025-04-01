"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import ForgotPassword from '../components/forgot-password';
import { Divider, Typography } from '@mui/material';
import createUser from '../server/create-user';
import NextLink from 'next/link';

export default function Signup() {

    const [state, formAction] = React.useActionState(createUser, { error: "" });
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Registro
            </Typography>
            <form action={formAction}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="fullname">Nombre completo</FormLabel>
                        <TextField
                            error={!!state.error}
                            helperText={state.error}
                            id="fullname"
                            type="text"
                            name="fullname"
                            placeholder="Nombre completo"
                            autoComplete="fullname"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={state.error ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            error={!!state.error}
                            helperText={state.error}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="email@ufps.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={state.error ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            error={!!state.error}
                            helperText={state.error}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={state.error ? 'error' : 'primary'}
                        />
                    </FormControl>

                    <ForgotPassword open={open} handleClose={handleClose} />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Registrarse
                    </Button>
                    <Link
                        component="button"
                        type="button"
                        onClick={handleClickOpen}
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                    >
                        Olvidaste tu contraseña?
                    </Link>

                </Box>
            </form>
            <Divider>O</Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                <Typography sx={{ textAlign: 'center' }}>
                    Ya tienes una cuenta?{' '}
                    <Link
                        component={NextLink}
                        href="/auth/login"
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                    >
                        Inicia sesión
                    </Link>


                </Typography>
            </Box>
        </>
    );
}