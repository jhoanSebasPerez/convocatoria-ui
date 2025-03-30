import { create } from "zustand";
import { Criterio, Rubrica } from "./rubrica-types";
import getRubricas from "./server/get-rubricas";
import createRubrica from "./server/create-rubrica";
import getCriterios from "./server/get-criterios";

interface RubricaStore {
    rubricas: Rubrica[];
    criterios: Criterio[];
    selectedRubrica: Rubrica | null;
    selectedCriterio: Criterio | null;
    criteriosToAdding: Criterio[];
    loading: boolean;
    showCreateRubricaDialog: boolean;
    error: string | null;
    fetchRubricas: (search: string) => Promise<void>;
    fetchCriterios: (search: string) => Promise<void>;
    selectRubrica: (id: string) => void;
    selectCriterio: (id: string) => void;
    clearSelectedRubrica: () => void;
    createRubrica: (rubrica: Rubrica) => Promise<void>;
    toggleShowCreateRubrica: (value: boolean) => void;
    addNewCriterion: (criterio: Criterio) => void;
    deleteCriterion: (id: string) => void;
}

export const useRubricaStore = create<RubricaStore>((set, get) => ({
    rubricas: [],
    criterios: [],
    criteriosToAdding: [],
    selectedRubrica: null,
    selectedCriterio: null,
    loading: false,
    error: null,
    showCreateRubricaDialog: false,

    toggleShowCreateRubrica: (value: boolean) => {
        set({ showCreateRubricaDialog: value });
    },

    fetchRubricas: async (search: string) => {
        set({ loading: true, error: null });

        try {
            const data = await getRubricas(search);
            set({ rubricas: data ?? [], loading: false });
        } catch (error) {
            set({ error: "No se pudieron cargar las rúbricas", loading: false });
        }
    },

    fetchCriterios: async (search: string) => {
        set({ loading: true, error: null });

        try {
            const data = await getCriterios(search);
            set({ criterios: data ?? [], loading: false });
        } catch (error) {
            set({ error: "No se pudieron cargar las rúbricas", loading: false });
        }
    },

    selectRubrica: (id: string) => {
        set({ loading: true, error: null, selectedRubrica: null, showCreateRubricaDialog: false });

        try {
            const rubrica = get().rubricas.find((r) => r.id === id);
            if (!rubrica) throw new Error("Rúbrica no encontrada");
            set({ selectedRubrica: rubrica, loading: false });
        } catch (error) {
            set({
                error: "No se pudo seleccionar la rúbrica", loading: false
            });
        }
    },

    addNewCriterion: (criterio: Criterio) => {
        set({ criteriosToAdding: [...get().criteriosToAdding, criterio] });
    },

    selectCriterio: (id: string) => {
        set({ loading: true, error: null, selectedCriterio: null });

        try {
            const criterio = get().criterios.find((c) => c.id === id);
            if (!criterio) throw new Error("Criterio no encontrado");

            const isDuplicate = get().criteriosToAdding.some((c) => c.id === id);
            if (isDuplicate) throw new Error("Criterio ya seleccionado");

            set({ selectedCriterio: criterio, loading: false, criteriosToAdding: [...get().criteriosToAdding, criterio] });
        } catch (error: any) {
            set({
                error: error.message, loading: false
            });
        }
    },

    createRubrica: async (rubrica: Rubrica) => {
        rubrica.criterios = get().criteriosToAdding.map((c) => ({
            nombre: c.nombre,
            descripcion: c.descripcion,
            puntajeMin: c.puntajeMin,
            puntajeMax: c.puntajeMax,
        }));
        set({ loading: true, error: null });
        try {
            const data = await createRubrica(rubrica);
            set({ loading: false, selectedRubrica: data, showCreateRubricaDialog: false });
        } catch (error) {
            set({ error: "No se pudo crear la rúbrica", loading: false });
        }
    },

    clearSelectedRubrica: () => {
        set({ selectedRubrica: null });
    },

    deleteCriterion: (id: string) => {
        set({ criteriosToAdding: get().criteriosToAdding.filter((c) => c.id !== id) });
    }
}));