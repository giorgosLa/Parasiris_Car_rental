"use client";

import { useEffect, useState } from "react";
import type { InsurancePlan } from "@prisma/client";

export function useInsurancePlans() {
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insurance/plans")
      .then((r) => r.json())
      .then((data: InsurancePlan[]) => setPlans(data))
      .finally(() => setLoading(false));
  }, []);

  return { plans, loading };
}
