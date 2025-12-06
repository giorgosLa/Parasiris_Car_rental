export interface InsurancePlan {
  id: number;
  title: string;
  description: string;
  dailyPrice: number;
  excessAmount: number;
  slug: string;
  active: boolean;
  includesWindScreen: boolean;
  includesTheftCover: boolean;
  roadsideAssistance: boolean;
  currency: string;
}
