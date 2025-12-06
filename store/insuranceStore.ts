import { create } from "zustand";

export interface InsurancePlan {
  id: string;
  title: string;
  dailyPrice: number;
  description?: string;
  [key: string]: unknown;
}

interface InsuranceStore {
  selected: InsurancePlan | null;
  selectInsurance: (plan: InsurancePlan) => void;
  clearInsurance: () => void;
}

export const useInsuranceStore = create<InsuranceStore>((set) => ({
  selected: null,

  selectInsurance: (plan) =>
    set({
      selected: {
        ...plan,
        dailyPrice: Number(plan.dailyPrice), // ensure numeric
      },
    }),

  clearInsurance: () => set({ selected: null }),
}));
