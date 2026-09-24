export type BookingErrorCode =
  | "NOT_FOUND"
  | "NOT_BOOKABLE"
  | "CAPACITY_REACHED"
  | "HOLD_EXPIRED"
  | "PAYMENT_FAILED"
  | "INVALID_PROMO"
  | "INVALID_INPUT";

/** Typed failure returned by booking methods; the UI renders states from `code`. */
export class BookingError extends Error {
  readonly code: BookingErrorCode;
  constructor(code: BookingErrorCode, message: string) {
    super(message);
    this.name = "BookingError";
    this.code = code;
  }
}

export function isBookingError(err: unknown): err is BookingError {
  return err instanceof Error && err.name === "BookingError" && "code" in err;
}
