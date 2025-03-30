"use client";

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/auth-store';
import Tooltip from "@mui/material/Tooltip";


type UserRole = 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';

const menuItems: Record<UserRole, { text: string; icon: React.JSX.Element, url: string }[]> = {
    "ADMIN": [
        { text: 'Home', icon: <HomeRoundedIcon />, url: '/' },
        { text: 'Convocatorias', icon: <AnalyticsRoundedIcon />, url: '/convocatorias' },
        { text: 'Proyectos', icon: <AssignmentRoundedIcon />, url: '/proyectos' },
        { text: 'Usuarios', icon: <PeopleRoundedIcon />, url: '/usuarios' },
    ],
    "DOCENTE": [
        { text: 'Home', icon: <HomeRoundedIcon />, url: '/' },
        { text: 'Proyectos Calificados', icon: <AssignmentRoundedIcon />, url: '/proyectos-calificados' },
    ],
    "ESTUDIANTE": [
        { text: 'Home', icon: <HomeRoundedIcon />, url: '/' },
        { text: 'Mis Proyectos', icon: <AssignmentRoundedIcon />, url: '/mis-proyectos' },
    ]
};

interface MenuContentProps {
    readonly isCollapsed?: boolean;
}

export default function MenuContent({ isCollapsed }: MenuContentProps) {
    const { user } = useAuthStore();
    const router = useRouter();
    const currentPath = usePathname();
    const [role, setRole] = React.useState<UserRole | null>(null);

    React.useEffect(() => {
        if (user && user.roles.length > 0) {
            setRole(user.roles[0] as UserRole);
        } else {
            setRole(null);
        }
    }, [user]);

    if (!role) return null;

    return (
        <Stack spacing={2} sx={{ mt: 2 }}>
            <List dense>

                {menuItems[role].map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ListItemButton
                            selected={currentPath === item.url}
                            onClick={() => router.push(item.url)}
                            sx={{
                                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" }, // 🔹 Color al hacer hover
                                borderRadius: "8px", // 🔹 Bordes redondeados en hover (opcional)
                            }}
                        >
                            <Tooltip title={item.text} placement="right" arrow disableInteractive>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: "center",
                                        py: 2,
                                        "&:hover": { color: "primary.main" }, // 🔹 Cambiar color del ícono al hover
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                            </Tooltip>
                            {!isCollapsed && <ListItemText primary={item.text} sx={{ ml: 2, p: 0 }} />}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}