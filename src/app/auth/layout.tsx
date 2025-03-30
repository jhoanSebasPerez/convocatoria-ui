"use client"

import CssBaseline from '@mui/material/CssBaseline';
import ColorModeSelect from '@/theme/color-mode-select';
import { Card } from '@/components/card';
import { AuthContainer } from '@/modules/auth/components/auth-continer';
import Image from 'next/image';
import { Box } from '@mui/material';

interface AuthLayoutProps {
    readonly children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <>
            <CssBaseline enableColorScheme />
            <AuthContainer direction="column" justifyContent="space-between">
                <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                <Card variant="outlined">
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "white", borderRadius: "4px" }}>
                        {/*<Image
                            src="/logo.png"
                            alt="Logo UFPS"
                            width={300}
                            height={200}
                            priority
                        />*/}
                    </Box>
                    {children}
                </Card>
            </AuthContainer>
        </>
    );
}