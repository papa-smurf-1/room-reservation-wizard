import { useState } from 'react';
import { Room, RoomType } from '@/types/room';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import RoomList from './RoomList';
import RoomForm from './RoomForm';

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  const handleAddRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = {
      ...room,
      id: Math.random().toString(36).substr(2, 9),
    };
    setRooms([...rooms, newRoom as Room]);
    setIsAddingRoom(false);
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    setRooms(rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">لوحة إدارة الفندق</h1>
        <Button onClick={() => setIsAddingRoom(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          إضافة غرفة جديدة
        </Button>
      </div>

      {isAddingRoom && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>إضافة غرفة جديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <RoomForm onSubmit={handleAddRoom} onCancel={() => setIsAddingRoom(false)} />
          </CardContent>
        </Card>
      )}

      <RoomList rooms={rooms} onUpdateRoom={handleUpdateRoom} />
    </div>
  );
}