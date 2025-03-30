import { Convocatoria } from "../convocatorias/convocatoria-types";
import { Evaluacion } from '../evaluaciones/evaluacion-type';
import { User } from "../users/users-types";

export interface Project {
    id?: string;
    titulo: string;
    convocatoriaId?: string;
    convocatoria?: Convocatoria;
    resumen: string;
    tiempoEjecucion: number;
    fechaInicio: string;
    evaluacion?: Evaluacion;
    fechaFin: string;
    tipoProyecto?: string;
    proyectoAula?: ProyectoAula;
    proyectoSemillero?: ProyectoSemillero;
    estudiantes: Student[];
    documentoUrl?: string;
    evaluador?: User;
}

export interface Student {
    id?: string;
    fullname: string;
    email: string;
    roles?: string[]
}

export interface ProyectoAula {
    curso: string;
    docenteOrientador: string;
    estadoFormulacion: string;
    estadoEjecucion: string;
    estadoTerminado: string;
    tipoProyecto: string;
    modalidadPresentacion: string;
}

export interface ProyectoSemillero {
    nombreSemillero: string;
    siglaSemillero: string;
    directorSemillero: string;
    modalidadPresentacion: string;
}