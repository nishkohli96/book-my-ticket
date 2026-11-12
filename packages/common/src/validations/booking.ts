import { z } from 'zod';

export const bookingRules = {
  maxSeatsPerBooking: 6,
  /** How long selected seats stay reserved while the user checks out. */
  holdDurationSeconds: 10 * 60,
  serviceFeeRate: 0.1,
  /** Mock payment gateway: any other valid card number is approved. */
  declinedTestCard: '4000000000000002',
};

export const createHoldSchema = z.object({
  eventId: z.string().min(1, { message: 'Event is required' }),
  seatIds: z
    .array(z.string().min(1))
    .min(1, { message: 'Select at least one seat' })
    .max(bookingRules.maxSeatsPerBooking, {
      message: `You can book at most ${bookingRules.maxSeatsPerBooking} seats at a time`
    }),
});

export type CreateHoldData = z.infer<typeof createHoldSchema>;

/** No real card data is ever stored or charged - this only shapes the mock checkout form. */
export const checkoutSchema = z.object({
  cardholderName: z
    .string('Cardholder name is required')
    .trim()
    .min(2, { message: 'Enter the name on the card' }),
  cardNumber: z
    .string('Card number is required')
    .transform(value => value.replace(/\s+/g, ''))
    .pipe(z.string().regex(/^\d{13,19}$/, { message: 'Enter a valid card number' })),
  expiry: z
    .string('Expiry is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Use MM/YY' }),
  cvv: z
    .string('CVV is required')
    .regex(/^\d{3,4}$/, { message: 'Enter a valid CVV' }),
});

export type CheckoutFormData = z.input<typeof checkoutSchema>;
