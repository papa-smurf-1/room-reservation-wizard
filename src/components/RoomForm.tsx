import { useState } from 'react';
import { Room, RoomType } from '@/types/room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface RoomFormProps {
  onSubmit: (room: Omit<Room, 'id'>) => void;
  onCancel: () => void;
}

export default function RoomForm({ onSubmit, onCancel }: RoomFormProps) {
  const [formData, setFormData] = useState({
    number: '',
    type: 'STANDARD' as RoomType,
    floor: 1,
    beds: 1,
    isAvailable: true,
    price: 0,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="number">رقم الغرفة</Label>
          <Input
            id="number"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">نوع الغرفة</Label>
          <Select
            value={formData.type}
            onValueChange={(value: RoomType) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع الغرفة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STANDARD">قياسية</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="SUITE">جناح</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor">الطابق</Label>
          <Input
            id="floor"
            type="number"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="beds">عدد الأسرة</Label>
          <Input
            id="beds"
            type="number"
            value={formData.beds}
            onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">السعر لليلة الواحدة</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">وصف الغرفة</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">حفظ</Button>
      </div>
    </form>
  );
}