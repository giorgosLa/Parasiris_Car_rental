ALTER TABLE "Reservation"
ADD COLUMN "stripeSessionId" TEXT;

CREATE UNIQUE INDEX "Reservation_stripeSessionId_key"
ON "Reservation"("stripeSessionId");
