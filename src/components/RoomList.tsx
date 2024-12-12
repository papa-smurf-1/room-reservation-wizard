import { Room } from '@/types/room';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface RoomListProps {
  rooms: Room[];
  onUpdateRoom?: (updatedRoom: Room) => void;
}

export default function RoomList({ rooms, onUpdateRoom }: RoomListProps) {
  const { toast } = useToast();

  const handleToggleAvailability = (room: Room) => {
    if (onUpdateRoom) {
      const updatedRoom = {
        ...room,
        isAvailable: !room.isAvailable,
        currentBooking: !room.isAvailable ? undefined : {
          id: Math.random().toString(36).substr(2, 9),
          startDate: new Date(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // غداً
          guestName: 'زائر جديد'
        }
      };
      onUpdateRoom(updatedRoom);
      
      toast({
        title: `تم تحديث حالة الغرفة ${room.number}`,
        description: `الغرفة الآن ${updatedRoom.isAvailable ? 'متاحة' : 'محجوزة'}`,
      });
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ar });
  };

  return (
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
  );
}