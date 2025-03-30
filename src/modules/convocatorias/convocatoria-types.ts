import { Project } from "../projects/project-type";
import { Rubrica } from "../rubricas/rubrica-types";

export interface Convocatoria {
    id?: string;
    titulo: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    rubricaId?: string;
    rubrica?: Rubrica;
    proyectos?: Project[];
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}