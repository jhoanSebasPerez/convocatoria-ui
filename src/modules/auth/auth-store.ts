"use client";

import { create } from "zustand";
import { User } from "../users/users-types";
import logout from "./server/logout";
import { changePassword, updateProfile } from "../users/server/update-user";
import { get } from "@/common/util/fetch";
import fetchProfile from "./server/fetch-profile";

interface AuthState {
    user: User | null;
    loading: boolean;
    fetchProfile: () => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: { email: string, fullname: string }) => Promise<void>;
    changePassword: (data: { newPassword: string, confirmPassword: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    // 🔄 Obtener el perfil del usuario
    fetchProfile: async () => {
        set({ loading: true });
        try {
            const response = await fetchProfile();

            if (response) {
                set({
                    user: {
                        id: response.id,
                        email: response.email,
                        roles: Array.isArray(response.roles) ? response.roles : [],
                        fullname: response.fullname,
                    },
                    loading: false,
                });
            } else {
                set({ user: null, loading: false });
            }
        } catch (error) {
            console.error("Error obteniendo el perfil:", error);
            set({ user: null, loading: false });
        }
    },

    logout: async () => {
        try {
            await logout();
            set({ user: null, loading: false });
        } catch (error) {
            console.error("Error during logout:", error);
            set({ user: null, loading: false }); // Asegurar cambio de estado
        }
    },

    updateProfile: async (data: { email: string, fullname: string }) => {
        await updateProfile(data);
        await useAuthStore.getState().fetchProfile();

    },

    changePassword: async (data: { newPassword: string, confirmPassword: string }) => {
        set({ loading: true });
        await changePassword(data);
        set({ loading: false });
    }
}));