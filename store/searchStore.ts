import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CarResult } from "@/types/car";

export interface SearchCriteria {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  days?: number;
}

interface SearchStore {
  criteria: SearchCriteria | null;
  results: CarResult[] | null;
  setSearchData: (criteria: SearchCriteria, results: CarResult[]) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      criteria: null,
      results: null,

      setSearchData: (criteria, results) => set({ criteria, results }),

      clearSearch: () => set({ criteria: null, results: null }),
    }),
    {
      name: "search-storage",
      partialize: (state) => ({
        criteria: state.criteria,
        results: state.results,
      }),
    }
  )
);
