// src/store/useStore.ts
import { create } from "zustand";
import { Stop } from "../domain/entities/Stop";
import { IStopRepository } from "../domain/repositories/IStopRepository";

interface AppState {
  user: string | null;
  favoriteStops: Stop[];
  login: (userId: string) => void;
  logout: () => void;
  setFavorites: (stops: Stop[]) => void;
  addStop: (stop: Stop) => void;
  removeStop: (stopId: number) => void;
  loadFavorites: (repo: IStopRepository) => Promise<void>;
  addFavoriteOptimistic: (stop: Stop, repo: IStopRepository) => Promise<void>;
  removeFavoriteOptimistic: (
    stopId: number,
    repo: IStopRepository,
  ) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  favoriteStops: [],

  login: (userId) => set({ user: userId }),
  logout: () => set({ user: null, favoriteStops: [] }),

  setFavorites: (stops) => set({ favoriteStops: stops }),

  addStop: (stop) =>
    set((state) => ({
      favoriteStops: [...state.favoriteStops, stop],
    })),

  removeStop: (stopId) =>
    set((state) => ({
      favoriteStops: state.favoriteStops.filter((s) => s.stopId !== stopId),
    })),

  loadFavorites: async (repo) => {
    const { user } = get();
    if (!user) return;

    const stops = await repo.getFavorites(user);
    set({ favoriteStops: stops });
  },

  // Optimistic UI: najpierw zmieniamy listę na ekranie, potem zapisujemy
  // w bazie, a przy błędzie wracamy do poprzedniego stanu (rollback)
  addFavoriteOptimistic: async (stop, repo) => {
    const { user, favoriteStops: previousStops } = get();
    if (!user) return;

    const withoutDuplicate = previousStops.filter((s) => !s.equals(stop));
    set({ favoriteStops: [...withoutDuplicate, stop] });

    try {
      await repo.saveFavorite(user, stop);
    } catch (error) {
      console.error("Nie udało się zapisać ulubionego przystanku:", error);
      set({ favoriteStops: previousStops });
    }
  },

  removeFavoriteOptimistic: async (stopId, repo) => {
    const { user, favoriteStops: previousStops } = get();
    if (!user) return;

    set({ favoriteStops: previousStops.filter((s) => s.stopId !== stopId) });

    try {
      await repo.removeFavorite(user, stopId);
    } catch (error) {
      console.error("Nie udało się usunąć ulubionego przystanku:", error);
      set({ favoriteStops: previousStops });
    }
  },
}));
