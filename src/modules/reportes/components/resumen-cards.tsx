"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import getResumeCards, { ResumeCardsType } from "../server/get-resume-cards";

export default function ResumenCards() {
    const [data, setData] = useState<ResumeCardsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getResumeCards().then((res: any) => {
            setData(res);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Grid container spacing={3}>
            {/* Usuarios */}
            <Grid item xs={12} sm={4}>
                <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <PeopleRoundedIcon fontSize="large" sx={{ color: "primary.main", mr: 2 }} />
                    <CardContent>
                        <Typography variant="h6">Usuarios</Typography>
                        <Typography variant="h4">{data?.usuarios}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Convocatorias */}
            <Grid item xs={12} sm={4}>
                <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <EventNoteRoundedIcon fontSize="large" sx={{ color: "secondary.main", mr: 2 }} />
                    <CardContent>
                        <Typography variant="h6">Convocatorias</Typography>
                        <Typography variant="h4">{data?.convocatorias}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Proyectos */}
            <Grid item xs={12} sm={4}>
                <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <FolderRoundedIcon fontSize="large" sx={{ color: "success.main", mr: 2 }} />
                    <CardContent>
                        <Typography variant="h6">Proyectos</Typography>
                        <Typography variant="h4">{data?.proyectos}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}