import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;

if (!resendKey) {
  console.warn("RESEND_API_KEY is not set. Email sending is disabled.");
}

export const resend = resendKey ? new Resend(resendKey) : null;
