"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    Button,
    Typography,
    Tooltip,
    CircularProgress,
    Paper,
    Box,
    Snackbar,
    Grid,
    Stack,
    Alert,
} from "@mui/material";
import dayjs from "dayjs";
import { API_URL } from "@/common/constants/api";
import createProject from "@/modules/projects/server/create-project";
import { useParams } from "next/navigation";
import getConvocatoriaById from "@/modules/convocatorias/server/get-convocatoria-by-id";
import { Convocatoria } from "@/modules/convocatorias/convocatoria-types";
import { CloudUploadOutlined, RemoveCircle } from "@mui/icons-material";
import CustomDatePicker from "@/components/date-picker";
import uploadFile from "@/modules/projects/server/upload-file";

type FormularioProyectoProps = {
    readonly params: Promise<{ convocatoriaId: string }>;
}

export default function FormularioProyecto({ params }: FormularioProyectoProps) {

    const { convocatoriaId } = use(params);

    const [convocatoria, setConvocatoria] = useState<Convocatoria>();

    const { control, register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            titulo: "",
            resumen: "",
            fechaInicio: dayjs(),
            fechaFin: dayjs(),
            tiempoEjecucion: "",
            tipoProyecto: "Seleccione un tipo de proyecto",
            curso: "",
            docenteOrientador: "",
            estadoFormulacion: "",
            estadoEjecucion: "",
            estadoTerminado: "",
            nombreSemillero: "",
            siglaSemillero: "",
            categoriaProyecto: "INNOVACION",
            directorSemillero: "",
            modalidadPresentacion: "POSTER",
            estudiantes: [{ nombre: "", correo: "" }],
            documento: localStorage.getItem("uploadedFileUrl") ?? "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "estudiantes",
    });

    const [fileName, setFileName] = useState(localStorage.getItem("filename") ?? "");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const tipoProyecto = watch("tipoProyecto");

    useEffect(() => {
        if (convocatoriaId) {
            getConvocatoriaById(convocatoriaId).then((data) => {
                if (data) {
                    setConvocatoria(data);
                }
            });
        }
    }, [convocatoriaId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const file = e.target.files[0];
            setUploading(true);
            setProgress(0);

            let fakeProgress = 0;
            const interval = setInterval(() => {
                if (fakeProgress < 90) {
                    fakeProgress += 10;
                    setProgress(fakeProgress);
                }
            }, 300);

            try {
                const response = await uploadFile(file);

                if (response.error) {
                    const body = await response.json();
                    const message = body.message || "Error uploading file";
                    throw new Error(message);
                } else {
                    const data = await response.data
                    localStorage.setItem("uploadedFileUrl", data.url);
                    setValue("documento", data.url);
                    setFileName(file.name);
                    localStorage.setItem("filename", file.name);
                }


            } catch (error: any) {
                console.error("Error uploading file:", error);
                setError(error.message);
            } finally {
                clearInterval(interval);
                setProgress(100);
                setUploading(false);
            }
        }
    };

    const removeFile = () => {
        setFileName("");
        setUploading(false);
        setProgress(0);
        setValue("documento", "");
        localStorage.setItem("uploadedFileUrl", "");
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        const formattedData = {
            titulo: data.titulo,
            resumen: data.resumen,
            convocatoriaId: Array.isArray(convocatoriaId) ? convocatoriaId[0] : convocatoriaId, // Aquí deberías pasar el ID real de la convocatoria
            tiempoEjecucion: parseInt(data.tiempoEjecucion, 10),
            fechaInicio: data.fechaInicio.toISOString(),
            documentoUrl: data.documento,
            fechaFin: data.fechaFin.toISOString(),
            estudiantes: data.estudiantes.map((estudiante: { nombre: string, correo: string }) => ({
                fullname: estudiante.nombre,
                email: estudiante.correo,
            })), // Solo nombres
            proyectoAula: data.tipoProyecto === "AULA" ? {
                curso: data.curso,
                docenteOrientador: data.docenteOrientador,
                estadoFormulacion: data.estadoFormulacion,
                estadoEjecucion: data.estadoEjecucion,
                estadoTerminado: data.estadoTerminado,
                tipoProyecto: data.categoriaProyecto,
                modalidadPresentacion: data.modalidadPresentacion
            } : undefined,
            proyectoSemillero: data.tipoProyecto === "SEMILLERO" ? {
                nombreSemillero: data.nombreSemillero,
                siglaSemillero: data.siglaSemillero,
                directorSemillero: data.directorSemillero,
                modalidadPresentacion: data.modalidadPresentacion
            } : undefined,
        };

        try {
            const { error } = await createProject(formattedData);
            if (error) {
                setError(error);
            }
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setLoading(false);
            setFileName("");
            localStorage.removeItem("filename");
            localStorage.removeItem("uploadedFileUrl");
        }
    };

    return (
        <Paper elevation={2} sx={{ width: "100%", mx: "auto", p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Convocatoria: {convocatoria?.titulo}
            </Typography>
            <Typography variant="h6" gutterBottom>Registro de Proyecto</Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Selecciona un tipo de proyecto</h3>
                <Grid container spacing={3}>
                    {/* SECCIÓN IZQUIERDA */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <Select {...register("tipoProyecto")} defaultValue="Seleccione un tipo de proyecto">
                                <MenuItem value="Seleccione un tipo de proyecto" disabled>Seleccione un tipo de proyecto</MenuItem>
                                <MenuItem value="AULA">Proyecto Aula</MenuItem>
                                <MenuItem value="SEMILLERO">Proyecto Semillero</MenuItem>
                            </Select>
                        </FormControl>

                        {tipoProyecto === "AULA" && (
                            <>
                                <TextField fullWidth placeholder="Curso" {...register("curso")} margin="normal" />
                                <TextField sx={{ marginBottom: "25px" }} variant="outlined" fullWidth placeholder="Docente Orientador" {...register("docenteOrientador")} margin="normal" />

                                <h3 className="mb-0">Porcentaje trabajado del proyecto</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField fullWidth type="number" placeholder="Estado de formulación (%)" {...register("estadoFormulacion")} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField fullWidth type="number" placeholder="Estado de ejecución (%)" {...register("estadoEjecucion")} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField fullWidth type="number" placeholder="Estado de terminado (%)" {...register("estadoTerminado")} />
                                    </Grid>
                                </Grid>
                                <Tooltip sx={{ marginBottom: "25px" }} title="Ingresa en porcentaje (%) el estado de formulación, ejecución y terminado del proyecto">
                                    <Typography variant="body2" color="primary">ℹ️</Typography>
                                </Tooltip>

                                <h3 className="mb-0">Categoría del proyecto</h3>
                                <FormControl sx={{ marginTop: 0 }} fullWidth margin="normal">
                                    <Select {...register("categoriaProyecto")} defaultValue="EMPRENDIMIENTO">
                                        <MenuItem value="INNOVACION">Innovación</MenuItem>
                                        <MenuItem value="EMPRENDIMIENTO">Emprendimiento</MenuItem>
                                        <MenuItem value="APRENDIZAJE_AULA">Aprendizaje de aula</MenuItem>
                                        <MenuItem value="INTEGRADOR">Integrador</MenuItem>
                                    </Select>
                                </FormControl>

                                <h3 className="mb-0">Modalidad de Presentación</h3>
                                <FormControl sx={{ marginTop: 0 }} fullWidth margin="normal">
                                    <Select {...register("modalidadPresentacion")} defaultValue="POSTER">
                                        <MenuItem value="POSTER">Póster</MenuItem>
                                        <MenuItem value="VIDEO">Video</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}

                        {tipoProyecto === "SEMILLERO" && (
                            <>
                                <TextField fullWidth placeholder="Nombre del Semillero" {...register("nombreSemillero")} margin="normal" />
                                <TextField fullWidth placeholder="Sigla del Semillero" {...register("siglaSemillero")} margin="normal" />
                                <TextField fullWidth placeholder="Director del Semillero" {...register("directorSemillero")} margin="normal" />
                                <h3 className="mb-0">Modalidad de Presentación</h3>
                                <FormControl sx={{ marginTop: 0 }} fullWidth margin="normal">
                                    <Select {...register("modalidadPresentacion")} defaultValue="ORAL">
                                        <MenuItem value="ORAL">Oral</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Grid>

                    {/* SECCIÓN DERECHA */}
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth placeholder="Título" {...register("titulo")} sx={{ marginBottom: "6px" }} />
                        <TextField fullWidth variant="outlined" placeholder="resumen" {...register("resumen")} sx={{ marginBottom: "6px" }} />
                        <TextField fullWidth type="number" placeholder="Tiempo de ejecución (meses)" {...register("tiempoEjecucion")} sx={{ marginBottom: "6px" }} />
                        <Box sx={{ display: "flex", gap: "16px", marginY: "25px", width: "100%" }}>
                            <Box>
                                <h3 className="mb-0">Fecha de inicio</h3>
                                <CustomDatePicker
                                    value={watch("fechaInicio")}
                                    onChange={(newValue) => newValue && setValue("fechaInicio", newValue)}
                                />
                            </Box>
                            <Box>
                                <h3 className="mb-0">Fecha de finalización</h3>
                                <CustomDatePicker
                                    value={watch("fechaFin")}
                                    onChange={(newValue) => newValue && setValue("fechaFin", newValue)}
                                />
                            </Box>
                        </Box>
                        <Typography variant="h6" gutterBottom>Estudiantes</Typography>
                        {fields.map((item, index) => (
                            <Grid sx={{ marginBottom: "8px", gap: "3" }} container key={item.id} alignItems="space-between">
                                <Grid item xs={5}>
                                    <TextField fullWidth placeholder="Nombre" {...register(`estudiantes.${index}.nombre`)} />
                                </Grid>
                                <Grid sx={{ marginLeft: "8px" }} item xs={5}>
                                    <TextField fullWidth placeholder="Correo" {...register(`estudiantes.${index}.correo`)} />
                                </Grid>
                                <Grid sx={{ marginLeft: "13px" }} item xs={1}>
                                    <Button fullWidth variant="contained" color="error" onClick={() => remove(index)}>
                                        <RemoveCircle />
                                    </Button>
                                </Grid>
                            </Grid>
                        ))}
                        <p className="text-slate-600 text-sm"><i>Usted será también agregado como integrante del proyecto por defecto</i></p>

                        {fields?.length < 3 && (
                            <Button sx={{ marginTop: "8px", marginBottom: "16px" }} variant="contained" color="primary" onClick={() => append({ nombre: "", correo: "" })}>
                                + Agregar estudiante
                            </Button>
                        )}

                        <Typography variant="h6" gutterBottom mt={2}>Subir Documento</Typography>
                        {!fileName ? (
                            <Stack spacing={1} alignItems="center">
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    component="label"
                                    startIcon={<CloudUploadOutlined />}
                                >
                                    Seleccionar archivo
                                    <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
                                </Button>
                                <Typography variant="caption" color="text.secondary">
                                    📄 Solo archivos PDF | Máx. 2MB
                                </Typography>
                            </Stack>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "8px" }}>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Typography>{fileName}</Typography>
                                    <Button color="error" onClick={removeFile}>❌</Button>
                                </Grid>
                                {uploading && (
                                    <motion.div initial={{ width: "0%" }} animate={{ width: `${progress}%` }} style={{ background: "blue", height: "5px", borderRadius: "4px" }} />
                                )}
                            </motion.div>
                        )}
                    </Grid>
                </Grid>

                <Grid container justifyContent="flex-end" mt={3}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading && <CircularProgress size={8} sx={{ marginRight: 1 }} />}
                        Guardar Proyecto
                    </Button>
                </Grid>
            </form>
            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError("")}
                anchorOrigin={{ vertical: "top", horizontal: "right" }} // 🔹 Ajusta la posición si deseas
            >
                <Alert
                    onClose={() => setError("")}
                    severity="error" // 🔹 Cambia el color a rojo
                    sx={{ width: "100%" }} // 🔹 Asegura que ocupe todo el ancho del Snackbar
                >
                    {error}
                </Alert>
            </Snackbar>
        </Paper >
    );
}
