export type BookingField = 'name' | 'phone' | 'choice' | 'date' | 'time'

export type BookingState =
  | { status: 'idle' }
  | { status: 'error'; message: string; errors?: Partial<Record<BookingField, string>> }
  | {
      status: 'success'
      mode: 'beauty' | 'course'
      summary: { name: string; phone: string; choice: string; date?: string; time?: string; note?: string }
    }

export const initialBookingState: BookingState = { status: 'idle' }
