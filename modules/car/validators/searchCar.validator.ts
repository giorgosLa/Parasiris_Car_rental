import { z } from "zod";

export const searchCarSchema = z.object({
  pickupDate: z.string(),
  dropoffDate: z.string(),
  pickupTime: z.string(),
  dropoffTime: z.string(),
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
});
