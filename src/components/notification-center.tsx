"use client";

import { useEffect, useState } from "react";
import { ButtonTypeEnum, IMessage, NovuProvider, PopoverNotificationCenter } from "@novu/notification-center";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuthStore } from "@/modules/auth/auth-store";
import { Badge } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotificationCenter() {
    const router = useRouter();

    const theme = useTheme();
    const { user } = useAuthStore();
    const [subscriberId, setSubscriberId] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            setSubscriberId(user.id); // 🔹 Usa el ID del usuario autenticado como subscriberId
        }

    }, [user?.id]);

    const handleNotification = (event: any) => {
        const { payload } = event;
        router.push(payload.urlAccion);
    };

    const handleActionClick = (templateIdentifier: string, type: ButtonTypeEnum, message: IMessage) => {
        const { cta } = message;
        if (cta) {
            const url = cta.action?.buttons?.[0]?.url;
            if (url) {
                router.push(url);
            }
        }
    };

    if (!subscriberId) return null; // Evita renderizar si no hay usuario

    return (
        <NovuProvider subscriberId={subscriberId} applicationIdentifier="u4pqdjbPEG4e">
            <PopoverNotificationCenter onActionClick={handleActionClick} onNotificationClick={handleNotification} colorScheme={theme.palette.mode === "dark" ? "dark" : "light"}>
                {({ unseenCount }) => (
                    <IconButton aria-label="Open notifications" sx={{ width: '2.25rem', height: '2.25rem' }}>
                        <Badge badgeContent={unseenCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                )}
            </PopoverNotificationCenter>
        </NovuProvider>

    );
}