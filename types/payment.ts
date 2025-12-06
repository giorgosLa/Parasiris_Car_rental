export interface StripeSessionData {
  id: string;
  amount_total: number;
  status: string;
  receipt_url: string | null;
}
