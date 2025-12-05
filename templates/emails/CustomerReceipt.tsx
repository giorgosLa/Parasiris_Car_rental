import * as React from "react";

interface CustomerReceiptProps {
  name: string;
  reservationId: number;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  carName: string;
  insurance: string;
  total: number;
}

export const CustomerReceipt = ({
  name,
  reservationId,
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
  carName,
  insurance,
  total,
}: CustomerReceiptProps) => (
  <div>
    <h2>Hello {name}, your reservation is confirmed!</h2>

    <p>Thank you for your booking. Here are your details:</p>

    <ul>
      <li>
        <strong>Reservation ID:</strong> {reservationId}
      </li>
      <li>
        <strong>Car:</strong> {carName}
      </li>
      <li>
        <strong>Insurance:</strong> {insurance}
      </li>
      <li>
        <strong>Pickup:</strong> {pickupDate} {pickupTime}
      </li>
      <li>
        <strong>Dropoff:</strong> {dropoffDate} {dropoffTime}
      </li>
      <li>
        <strong>Total Cost:</strong> €{total.toFixed(2)}
      </li>
    </ul>

    <p>If you have any questions, reply to this email.</p>
  </div>
);
