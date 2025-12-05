import { create } from "zustand";
import type { SearchCriteria } from "./searchStore";
import type { CarResult } from "@/types/car";
import type { InsurancePlan } from "@/types/insurance";

interface BookingStore {
  selectedCar: CarResult | null;
  selectedInsurance: InsurancePlan | null;
  criteria: SearchCriteria | null;

  setSelectedCar: (car: CarResult) => void;
  setSelectedInsurance: (plan: InsurancePlan) => void;
  setCriteria: (criteria: SearchCriteria) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedCar: null,
  selectedInsurance: null,
  criteria: null,

  setSelectedCar: (car) => set({ selectedCar: car }),
  setSelectedInsurance: (plan) => set({ selectedInsurance: plan }),
  setCriteria: (criteria) => set({ criteria }),

  clearBooking: () =>
    set({
      selectedCar: null,
      selectedInsurance: null,
      criteria: null,
    }),
}));
