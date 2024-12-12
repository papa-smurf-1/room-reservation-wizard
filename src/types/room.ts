export type RoomType = 'STANDARD' | 'VIP' | 'SUITE';

export interface Booking {
  id: string;
  startDate: Date;
  endDate: Date;
  guestName: string;
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  floor: number;
  beds: number;
  isAvailable: boolean;
  price: number;
  description: string;
  currentBooking?: Booking;
}