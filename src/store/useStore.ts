// src/store/useStore.ts
import { create } from "zustand";
import { Stop } from "../domain/entities/Stop";
import { IStopRepository } from "../domain/repositories/IStopRepository";

// Dworzec Główny ma wiele słupków, więc na start pokazujemy przykładowy przystanek
const DEFAULT_STOP_ID = 2072;

interface AppState {
  user: string | null;
  username: string | null;
  selectedStopId: number;
  favoriteStops: Stop[];
  login: (userId: string, username: string) => void;
  logout: () => void;
  selectStop: (stopId: number) => void;
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
  username: null,
  selectedStopId: DEFAULT_STOP_ID,
  favoriteStops: [],

  login: (userId, username) => set({ user: userId, username }),
  logout: () => set({ user: null, username: null, favoriteStops: [] }),

  selectStop: (stopId) => set({ selectedStopId: stopId }),

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
