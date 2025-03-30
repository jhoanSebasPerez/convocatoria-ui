"use client"

import AppTheme from "@/theme/app-theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from '../theme/customizations';

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};


interface ProvidersProps {
    readonly children: React.ReactNode;
    readonly authenticated: boolean;
    readonly disableCustomTheme?: any;
}

export function Providers({ children, disableCustomTheme }: ProvidersProps) {
    return (
        <AppRouterCacheProvider>
            <AppTheme {...disableCustomTheme} themeComponents={xThemeComponents}>
                {children}
            </AppTheme>
        </AppRouterCacheProvider>
    )
}