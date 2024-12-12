import { Room } from '@/types/room';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

interface RoomListProps {
  rooms: Room[];
  onUpdateRoom?: (updatedRoom: Room) => void;
}

export default function RoomList({ rooms, onUpdateRoom }: RoomListProps) {
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    endDate: '',
    guestName: ''
  });

  const handleToggleAvailability = (room: Room) => {
    if (room.isAvailable) {
      setSelectedRoom(room);
      setBookingDetails({
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        guestName: ''
      });
    } else {
      updateRoomStatus(room, true);
    }
  };

  const handleBookingSubmit = () => {
    if (selectedRoom && onUpdateRoom) {
      const updatedRoom = {
        ...selectedRoom,
        isAvailable: false,
        currentBooking: {
          id: Math.random().toString(36).substr(2, 9),
          startDate: new Date(bookingDetails.startDate),
          endDate: new Date(bookingDetails.endDate),
          guestName: bookingDetails.guestName || 'زائر جديد'
        }
      };
      onUpdateRoom(updatedRoom);
      setSelectedRoom(null);
      
      toast({
        title: `تم تحديث حالة الغرفة ${updatedRoom.number}`,
        description: `تم حجز الغرفة من ${formatDate(updatedRoom.currentBooking.startDate)} إلى ${formatDate(updatedRoom.currentBooking.endDate)}`,
      });
    }
  };

  const updateRoomStatus = (room: Room, makeAvailable: boolean) => {
    if (onUpdateRoom) {
      const updatedRoom = {
        ...room,
        isAvailable: makeAvailable,
        currentBooking: makeAvailable ? undefined : room.currentBooking
      };
      onUpdateRoom(updatedRoom);
      
      toast({
        title: `تم تحديث حالة الغرفة ${room.number}`,
        description: `الغرفة الآن ${makeAvailable ? 'متاحة' : 'محجوزة'}`,
      });
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ar });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>غرفة {room.number}</CardTitle>
                <Badge variant={room.isAvailable ? "default" : "destructive"}>
                  {room.isAvailable ? 'متاحة' : 'محجوزة'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">الطابق: {room.floor}</p>
                <p className="text-sm text-muted-foreground">النوع: {room.type}</p>
                <p className="text-sm text-muted-foreground">عدد الأسرة: {room.beds}</p>
                <p className="font-semibold text-primary">{room.price} ريال/ليلة</p>
                <p className="text-sm">{room.description}</p>
                
                {room.currentBooking && !room.isAvailable && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">تفاصيل الحجز:</h4>
                    <p className="text-sm">اسم الضيف: {room.currentBooking.guestName}</p>
                    <p className="text-sm">تاريخ البداية: {formatDate(room.currentBooking.startDate)}</p>
                    <p className="text-sm">تاريخ النهاية: {formatDate(room.currentBooking.endDate)}</p>
                  </div>
                )}

                <Button 
                  variant={room.isAvailable ? "destructive" : "default"}
                  className="w-full mt-4"
                  onClick={() => handleToggleAvailability(room)}
                >
                  {room.isAvailable ? 'تحديد كمحجوزة' : 'تحديد كمتاحة'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={selectedRoom !== null} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حجز الغرفة {selectedRoom?.number}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="guestName">اسم الضيف</Label>
              <Input
                id="guestName"
                value={bookingDetails.guestName}
                onChange={(e) => setBookingDetails({ ...bookingDetails, guestName: e.target.value })}
                placeholder="أدخل اسم الضيف"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">تاريخ بداية الحجز</Label>
              <Input
                id="startDate"
                type="date"
                value={bookingDetails.startDate}
                onChange={(e) => setBookingDetails({ ...bookingDetails, startDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">تاريخ نهاية الحجز</Label>
              <Input
                id="endDate"
                type="date"
                value={bookingDetails.endDate}
                onChange={(e) => setBookingDetails({ ...bookingDetails, endDate: e.target.value })}
              />
            </div>
            <Button onClick={handleBookingSubmit}>تأكيد الحجز</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}