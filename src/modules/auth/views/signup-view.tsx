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
import { RegisterRequest } from '../auth-types';


export default function Signup() {

    const [response, setResponse] = React.useState({ error: "" });
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const registerRequest: RegisterRequest = {
            fullname: form.fullname.value,
            email: form.email.value,
            password: form.password.value,
        }
        const res = await createUser(response, registerRequest);
        if (res.error) {
            setResponse(res);
        }
    }

    return (
        <>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Registro
            </Typography>
            <form >
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
                            error={!!response.error}
                            helperText={response.error}
                            id="fullname"
                            type="text"
                            name="fullname"
                            placeholder="Nombre completo"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={response.error ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            error={!!response.error}
                            helperText={response.error}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="email@ufps.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={response.error ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            error={!!response.error}
                            helperText={response.error}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={response.error ? 'error' : 'primary'}
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