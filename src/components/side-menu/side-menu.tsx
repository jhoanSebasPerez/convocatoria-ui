"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./menu-content";
import OptionsMenu from "./options-menu";
import RolHeader from "./rol-header";
import Skeleton from "@mui/material/Skeleton";
import { useAuthStore } from "@/modules/auth/auth-store";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const drawerWidth = 240;
const collapsedWidth = 60;

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: open ? drawerWidth : collapsedWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    "& .MuiDrawer-paper": {
        width: open ? drawerWidth : collapsedWidth,
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
}));

export default function SideMenu() {
    const { user, loading, fetchProfile } = useAuthStore();
    const [open, setOpen] = React.useState(true);

    React.useEffect(() => {
        if (!user) fetchProfile();
    }, [user, fetchProfile]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    if (loading) {
        return (
            <Drawer variant="permanent" open={open}>
                <Box sx={{ p: 2 }}>
                    <Skeleton variant="rectangular" width="100%" height={40} />
                    <Skeleton variant="rectangular" width="80%" height={20} sx={{ mt: 1 }} />
                </Box>
            </Drawer>
        );
    }

    const formatLongName = (name: string) => {
        const names = name.split(" ");
        return `${names[0]} ${names[names.length - 1]}`;
    }

    const formatLongEmail = (email: string) => {
        const parts = email.split("@");
        return `${parts[0].slice(0, 5)}...@${parts[1]}`;
    }

    return (
        <Drawer variant="permanent" open={open}>
            {/* 🔹 Botón para expandir/colapsar */}
            <Box sx={{ display: "flex", justifyContent: open ? "space-between" : "center", p: 1.5 }}>
                {open && <RolHeader />}
                <IconButton onClick={toggleDrawer} sx={{ ml: open ? 1 : "auto" }}>
                    {open ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
            </Box>

            <Divider />

            <Box sx={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                <MenuContent isCollapsed={!open} />
            </Box>

            {!!user && (
                <Stack
                    direction="row"
                    sx={{
                        p: 2,
                        gap: 1,
                        alignItems: "center",
                        borderTop: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden", // Evita que el contenido sobresalga
                        flexWrap: "nowrap",
                    }}
                >
                    {open && (
                        <>
                            <Avatar
                                sizes="small"
                                alt={user.fullname}
                                src="/static/images/avatar/7.jpg"
                                sx={{ width: 36, height: 36 }}
                            />
                            <Box
                                sx={{
                                    mr: "auto",
                                    minWidth: 0, // Evita que el Box crezca demasiado
                                    flexGrow: 1, // Permite que se ajuste al espacio disponible
                                    overflow: "hidden", // Oculta el texto largo
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 500,
                                        lineHeight: "16px",
                                        whiteSpace: "nowrap", // No permite que el texto haga salto de línea
                                        overflow: "hidden", // Oculta el texto que sobresale
                                        textOverflow: "ellipsis", // Muestra "..." si el texto es muy largo
                                        display: "block",
                                    }}
                                >
                                    {formatLongName(user.fullname)}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "text.secondary",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "block",
                                    }}
                                >
                                    {formatLongEmail(user.email)}
                                </Typography>
                            </Box>
                        </>
                    )}
                    <OptionsMenu /> {/* Asegura que no se oculte */}
                </Stack>
            )}
        </Drawer>
    );
}