export type RoomType = 'STANDARD' | 'VIP' | 'SUITE';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  floor: number;
  beds: number;
  isAvailable: boolean;
  price: number;
  description: string;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  guestName: string;
}