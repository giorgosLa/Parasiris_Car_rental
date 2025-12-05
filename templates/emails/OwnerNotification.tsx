import * as React from "react";

interface OwnerEmailProps {
  reservationId: number;
  customerEmail: string;
  carName: string;
  total: number;
}

export const OwnerNotification = ({
  reservationId,
  customerEmail,
  carName,
  total,
}: OwnerEmailProps) => (
  <div>
    <h2>New Booking Received</h2>

    <ul>
      <li>
        <strong>Reservation ID:</strong> {reservationId}
      </li>
      <li>
        <strong>Customer Email:</strong> {customerEmail}
      </li>
      <li>
        <strong>Car:</strong> {carName}
      </li>
      <li>
        <strong>Total:</strong> €{total.toFixed(2)}
      </li>
    </ul>
  </div>
);
