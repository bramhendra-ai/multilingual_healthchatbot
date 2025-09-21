import MedicineReminder from '@/components/medicine-reminder';
import WaterReminder from '@/components/water-reminder';

export default function RemindersPage() {
  return (
    <div className="space-y-8">
      <MedicineReminder />
      <WaterReminder />
    </div>
  );
}
