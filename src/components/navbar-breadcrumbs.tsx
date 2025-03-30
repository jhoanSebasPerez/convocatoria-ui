'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: theme.palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

export default function NavbarBreadcrumbs() {
    const router = useRouter();
    const pathname = usePathname();       // e.g. "/proyectos/123"

    // Quita el primer elemento vacío si la ruta empieza con "/"
    const pathSegments = pathname.split('/').filter(Boolean);

    // Si estás en "/", solo quieres mostrar "Dashboard"
    if (pathname === '/') {
        return (
            <StyledBreadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextRoundedIcon fontSize="small" />}
            >
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Dashboard
                </Typography>
            </StyledBreadcrumbs>
        );
    }

    // ---- Para rutas distintas de "/" ----
    // Si deseas un mapeo para que "proyectos" -> "Proyectos", etc.:
    const labelMap: Record<string, string> = {
        proyectos: 'Proyectos',
        usuarios: 'Usuarios',
        convocatorias: 'Convocatorias',
        // ...
    };

    function segmentToLabel(segment: string) {
        // Si existe un label personalizado, úsalo
        if (labelMap[segment]) return labelMap[segment];
        // Si no, capitaliza
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    // Construye array de crumbs a partir de los segmentos.
    // Podrías omitir "Home" o "Dashboard" en subrutas si así lo deseas.
    const crumbs = pathSegments.map((segment, idx) => {
        const href = '/' + pathSegments.slice(0, idx + 1).join('/');
        return { label: segmentToLabel(segment), href };
    });

    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            {/* Renderiza cada crumb, enlazando menos el último */}
            {crumbs.map((crumb, idx) => {
                const removeDash = crumb.label.replace(/-/g, ' ');
                const label = removeDash.charAt(0).toUpperCase() + removeDash.slice(1);
                const isLast = idx === crumbs.length - 1;
                if (isLast) {
                    return (
                        <Typography
                            key={crumb.href}
                            variant="body1"
                            sx={{ color: 'text.primary', fontWeight: 600 }}
                        >
                            {label}
                        </Typography>
                    );
                }
                return (
                    <Link
                        key={crumb.href}
                        underline="hover"
                        color="inherit"
                        variant="body1"
                        onClick={(e) => {
                            e.preventDefault();
                            router.push(crumb.href);
                        }}
                        sx={{ cursor: 'pointer' }}
                    >
                        {label}
                    </Link>
                );
            })}
        </StyledBreadcrumbs>
    );
}