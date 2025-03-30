import createConvocatoria from "@/modules/convocatorias/server/create-convocatoria";
import getConvocatorias from "@/modules/convocatorias/server/get-convocatorias";
import { Convocatoria } from "@/modules/convocatorias/convocatoria-types";
import { create } from "zustand";
import { FormResponse } from "@/common/interfaces/form-response";

interface ConvocatoriaStore {
    convocatorias: Convocatoria[];
    fetchConvocatorias: () => Promise<void>;
    addNewConvocatoria: (convocatoria: Convocatoria) => Promise<FormResponse>;
}

export const useConvocatoriaStore = create<ConvocatoriaStore>((set) => ({
    convocatorias: [],
    fetchConvocatorias: async () => {
        const data = await getConvocatorias();
        if (data) {
            set({ convocatorias: data });
        }
    },
    addNewConvocatoria: async (convocatoria) => {
        const response = await createConvocatoria(convocatoria);
        if (response.error) {
            return { "error": response.error }
        }
        await useConvocatoriaStore.getState().fetchConvocatorias();
        return { error: "" }
    },
}));