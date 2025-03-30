import * as React from 'react';
import Copyright from './internals/components/copyright';
import { Box } from '@mui/material';

interface MainGridProps {
    readonly children: React.ReactNode;
}


export default function MainGrid({ children }: MainGridProps) {


    return (
        <Box sx={{ width: "100%", height: "100vh" }}>
            {children}
            <Copyright sx={{ my: 4 }} />
        </Box>

    );
}
