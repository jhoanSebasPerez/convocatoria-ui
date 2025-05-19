"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PictureAsPdf, CalendarMonth, FileDownload } from "@mui/icons-material";
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
    IconButton,
    Card,
    CardContent,
    Collapse,
    Fade,
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
} from "@mui/material";
import dayjs from "dayjs";
import { API_URL } from "@/common/constants/api";
import createProject from "@/modules/projects/server/create-project";
import { useParams } from "next/navigation";
import getConvocatoriaById from "@/modules/convocatorias/server/get-convocatoria-by-id";
import { Convocatoria } from "@/modules/convocatorias/convocatoria-types";
import { CloudUploadOutlined, RemoveCircle, PersonAdd, CheckCircle, ExpandMore, ExpandLess, AddCircleOutline, VisibilityOff } from "@mui/icons-material";
import CustomDatePicker from "@/components/date-picker";
import uploadFileServer from "@/modules/projects/server/upload-file";

// Define interfaces for form data structure
interface Estudiante {
    nombre: string;
    correo: string;
}

interface FormValues {
    titulo: string;
    resumen: string;
    fechaInicio: dayjs.Dayjs;
    fechaFin: dayjs.Dayjs;
    tiempoEjecucion: string;
    tipoProyecto: string;
    curso: string;
    docenteOrientador: string;
    estadoFormulacion: string;
    estadoEjecucion: string;
    estadoTerminado: string;
    nombreSemillero: string;
    siglaSemillero: string;
    categoriaProyecto: string;
    directorSemillero: string;
    modalidadPresentacion: string;
    estudiantes: Estudiante[];
    documento: string;
}

export default function FormularioProyecto() {

    const { id: convocatoriaId }: { id: string } = useParams();

    const [convocatoria, setConvocatoria] = useState<Convocatoria>();

    const { control, register, handleSubmit, setValue, watch, formState: { errors }, trigger } = useForm<FormValues>({
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
            estudiantes: [],
            documento: localStorage.getItem("uploadedFileUrl") ?? "",
        },
        mode: "onChange"
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
    const [showEstudiantesForm, setShowEstudiantesForm] = useState(false);
    const [openReportModal, setOpenReportModal] = useState(false);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs().subtract(1, 'month'));
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [generatingReport, setGeneratingReport] = useState(false);
    const [reportError, setReportError] = useState("");

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
                const response = await uploadFileServer(file);

                if (response.error) {
                    const body = response.error
                    const message = body.message || "Error uploading file";
                    throw new Error(message);
                } else {
                    const data = response;
                    console.log("response", data);
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

    const onSubmit = async (data: FormValues) => {
        if (showEstudiantesForm && fields.length > 0) {
            const estudiantesValidos = fields.every((field, index) => {
                const nombreValido = !!watch(`estudiantes.${index}.nombre`);
                const correoValido = !!watch(`estudiantes.${index}.correo`);

                return nombreValido && correoValido;
            });

            if (!estudiantesValidos) {
                setError("Completa todos los campos de estudiantes o cierra la sección");
                return;
            }
        }

        setLoading(true);

        const formattedData = {
            titulo: data.titulo,
            resumen: data.resumen,
            convocatoriaId: Array.isArray(convocatoriaId) ? convocatoriaId[0] : String(convocatoriaId),
            tiempoEjecucion: parseInt(data.tiempoEjecucion, 10),
            fechaInicio: data.fechaInicio.toISOString(),
            documentoUrl: data.documento,
            fechaFin: data.fechaFin.toISOString(),
            estudiantes: data.estudiantes.map((estudiante: { nombre: string, correo: string }) => ({
                fullname: estudiante.nombre,
                email: estudiante.correo,
            })),
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

                        <Box sx={{ mt: 3, mb: 2 }}>
                            <Card variant="outlined" sx={{
                                borderRadius: 2,
                                borderColor: showEstudiantesForm ? 'primary.main' : 'divider',
                                transition: 'all 0.3s ease'
                            }}>
                                <CardContent sx={{ pb: showEstudiantesForm ? 2 : 1, pt: 2 }}>
                                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PersonAdd sx={{ color: 'primary.main', mr: 1.5 }} />
                                            <Typography variant="h6">Estudiantes</Typography>
                                        </Box>

                                        <Button
                                            variant={showEstudiantesForm ? "outlined" : "contained"}
                                            color={showEstudiantesForm ? "secondary" : "primary"}
                                            onClick={() => {
                                                if (showEstudiantesForm && fields.length === 0) {
                                                    append({ nombre: "", correo: "" });
                                                }
                                                setShowEstudiantesForm(!showEstudiantesForm);
                                            }}
                                            startIcon={showEstudiantesForm ? <VisibilityOff /> : <AddCircleOutline />}
                                            size="small"
                                        >
                                            {showEstudiantesForm ? "Ocultar" : fields.length > 0 ? "Editar estudiantes" : "Agregar estudiantes"}
                                        </Button>
                                    </Stack>

                                    {/* Mensaje cuando no es visible pero hay estudiantes */}
                                    {!showEstudiantesForm && fields.length > 0 && (
                                        <Box sx={{ mt: 1.5 }}>
                                            <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 1 }}>
                                                {fields.length} {fields.length === 1 ? 'estudiante agregado' : 'estudiantes agregados'}
                                            </Alert>
                                            <Typography variant="caption" color="text.secondary">
                                                <i>Usted será también agregado como integrante del proyecto por defecto</i>
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Formulario de estudiantes colapsable */}
                                    <Collapse in={showEstudiantesForm} timeout="auto">
                                        <Box sx={{ mt: 2 }}>
                                            {fields.length === 0 ? (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => append({ nombre: "", correo: "" })}
                                                        startIcon={<AddCircleOutline />}
                                                    >
                                                        Añadir primer estudiante
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <>
                                                    {fields.map((item, index) => (
                                                        <Box key={item.id} sx={{ mb: 2 }}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={5}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Nombre del estudiante"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        {...register(`estudiantes.${index}.nombre`, {
                                                                            required: showEstudiantesForm ? "Nombre requerido" : false
                                                                        })}
                                                                        error={showEstudiantesForm && !watch(`estudiantes.${index}.nombre`)}
                                                                        helperText={showEstudiantesForm && !watch(`estudiantes.${index}.nombre`) ? "Campo requerido" : ""}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={5}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Correo electrónico"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        type="email"
                                                                        {...register(`estudiantes.${index}.correo`, {
                                                                            required: showEstudiantesForm ? "Correo requerido" : false,
                                                                            pattern: {
                                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                                message: "Correo inválido"
                                                                            }
                                                                        })}
                                                                        error={showEstudiantesForm && !watch(`estudiantes.${index}.correo`)}
                                                                        helperText={showEstudiantesForm && !watch(`estudiantes.${index}.correo`) ? "Campo requerido" : ""}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={2}>
                                                                    <Button
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        color="error"
                                                                        onClick={() => remove(index)}
                                                                        size="medium"
                                                                        sx={{ height: '100%' }}
                                                                    >
                                                                        <RemoveCircle />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    ))}

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                        {fields.length < 3 && (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                size="small"
                                                                onClick={() => append({ nombre: "", correo: "" })}
                                                                startIcon={<AddCircleOutline />}
                                                                disabled={fields.length >= 3}
                                                            >
                                                                Añadir estudiante
                                                            </Button>
                                                        )}

                                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                                            <i>Usted será también agregado como integrante del proyecto por defecto</i>
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </Collapse>
                                </CardContent>
                            </Card>
                        </Box>

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
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        startIcon={<PictureAsPdf />}
                        onClick={() => setOpenReportModal(true)}
                        sx={{ ml: 2 }}
                    >
                        Generar Reporte
                    </Button>
                </Grid>
            </form>
            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError("")}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setError("")}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {error}
                </Alert>
            </Snackbar>

            {/* Modal para Generar Reporte */}
            <Dialog open={openReportModal} onClose={() => setOpenReportModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <PictureAsPdf color="primary" />
                        <Typography variant="h6">Generar Reporte PDF</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Seleccione el rango de fechas para generar el reporte de proyectos.
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                                <Typography variant="caption" color="text.secondary" mb={1}>
                                    Fecha Inicio:
                                </Typography>
                                <CustomDatePicker
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                                <Typography variant="caption" color="text.secondary" mb={1}>
                                    Fecha Fin:
                                </Typography>
                                <CustomDatePicker
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    {reportError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {reportError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReportModal(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={generatingReport ? <CircularProgress size={20} /> : <FileDownload />}
                        disabled={!startDate || !endDate || generatingReport}
                        onClick={async () => {
                            if (!startDate || !endDate) {
                                setReportError("Por favor seleccione ambas fechas");
                                return;
                            }

                            if (endDate.isBefore(startDate)) {
                                setReportError("La fecha fin debe ser posterior a la fecha de inicio");
                                return;
                            }

                            setReportError("");
                            setGeneratingReport(true);

                            try {
                                // Formato ISO para las fechas
                                const fechaInicio = startDate.format('YYYY-MM-DD');
                                const fechaFin = endDate.format('YYYY-MM-DD');

                                // Crear un enlace para descargar el PDF
                                const url = `${API_URL}/reportes/generar-pdf`;
                                const response = await fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ fechaInicio, fechaFin }),
                                });

                                if (!response.ok) {
                                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                                }

                                // Obtener el blob del PDF
                                const blob = await response.blob();
                                const downloadUrl = window.URL.createObjectURL(blob);
                                
                                // Crear un enlace temporal y hacer clic en él
                                const link = document.createElement('a');
                                link.href = downloadUrl;
                                link.download = `reporte_${fechaInicio}_${fechaFin}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                // Limpieza
                                window.URL.revokeObjectURL(downloadUrl);
                                setOpenReportModal(false);
                            } catch (error: any) {
                                console.error('Error al generar el reporte:', error);
                                setReportError(`Error al generar el reporte: ${error.message || 'Error desconocido'}`);
                            } finally {
                                setGeneratingReport(false);
                            }
                        }}
                    >
                        {generatingReport ? 'Generando...' : 'Generar Reporte'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper >
    );
}
