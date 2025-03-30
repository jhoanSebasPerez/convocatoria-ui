"use client"

import { alpha, Box, Button, Stack } from '@mui/material';
import SideMenu from './side-menu/side-menu';
import AppNavbar from './navbar';
import Header from './header';
import MainGrid from './main-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface LayoutClientProps {
    readonly children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
    const router = useRouter();

    return (
        <Box sx={{ display: 'flex' }}>
            <SideMenu />
            <AppNavbar />
            {/* Main content */}
            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                })}
            >
                <Stack
                    spacing={2}
                    sx={{
                        mx: 3,
                        pb: 5,
                        mt: { xs: 8, md: 0 },
                    }}
                >
                    <Header />
                    <Box sx={{ width: "40px", height: "40px" }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.back()}
                        >
                            volver
                        </Button>
                    </Box>
                    <MainGrid>
                        {children}
                    </MainGrid>
                </Stack>
            </Box>
        </Box>
    );
}