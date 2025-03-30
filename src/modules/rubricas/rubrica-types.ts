export interface Rubrica {
    id?: string;
    nombre: string;
    descripcion: string;
    criterios: Criterio[];
}

export interface Criterio {
    id?: string;
    nombre: string;
    puntajeMax: number;
    puntajeMin: number;
    descripcion: string;
}
