import { Rubrica } from "../rubricas/rubrica-types";

export interface EvaluacionCriterio {
    id?: string;
    nombre?: string
    descripcion?: string;
    criterioId: string; // ID del criterio evaluado
    puntaje: number; // Puntaje asignado al criterio
    comentario?: string; // Comentario opcional sobre el criterio
}

export interface Evaluacion {
    id?: string; // ID de la evaluación
    proyectoId: string; // ID del proyecto evaluado
    puntajeTotal: number; // Puntaje total obtenido en la evaluación
    observaciones?: string; // Observaciones generales del evaluador
    criteriosEvaluacion: EvaluacionCriterio[];// Lista de criterios evaluados
    rubrica?: Rubrica; // Rúbrica utilizada para la evaluación
    createAt?: string; // Fecha de la evaluación// Observaciones generales del evaluador
}