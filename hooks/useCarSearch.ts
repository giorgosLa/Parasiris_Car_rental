import { useState, useCallback } from "react";
import type { CarResult } from "@/types/car";

type SearchParams = {
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  seats?: number;
  categoryId?: number;
};

export function useCarSearch() {
  const [results, setResults] = useState<CarResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCars = useCallback(
    async (params: SearchParams): Promise<CarResult[]> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/cars/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        if (!res.ok) {
          throw new Error("Failed to search cars");
        }

        const data: CarResult[] = await res.json();
        setResults(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { results, loading, error, searchCars };
}
