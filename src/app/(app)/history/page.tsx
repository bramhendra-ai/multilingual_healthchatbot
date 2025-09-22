'use client';

import AdherenceChart from '@/components/adherence-chart';
import WaterChart from '@/components/water-chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useReminders } from '@/hooks/use-reminders';
import { format, subDays, addDays } from 'date-fns';
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ML_PER_GLASS = 250;

export default function HistoryPage() {
  const { t } = useTranslation();
  const { medicines, waterReminder } = useReminders();
  const [loading, setLoading] = useState(false);

  const generateReportData = () => {
    const reportData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayLabel = format(date, 'E');

      // Adherence data
      let totalDoses = 0;
      let takenDoses = 0;
      medicines.forEach((med) => {
        const startDate = new Date(med.startDate);
        const endDate = addDays(startDate, med.duration);
        if (date >= startDate && date <= endDate) {
          const dailyDoses = med.times.length;
          totalDoses += dailyDoses;

          const takenRecord = med.taken[dateString];
          if (takenRecord) {
            takenDoses += takenRecord.filter(Boolean).length;
          }
        }
      });
      const adherence =
        totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

      // Water intake data
      const intakeInMl = waterReminder.history[dateString] || 0;
      const glasses = Math.round(intakeInMl / ML_PER_GLASS);

      reportData.push({
        date: dateString,
        day: dayLabel,
        adherence,
        waterIntakeMl: intakeInMl,
        waterIntakeGlasses: glasses,
      });
    }
    return reportData;
  };

  const handleExport = () => {
    setLoading(true);
    try {
      const data = generateReportData();
      const doc = new jsPDF();

      doc.text("Health Report - Last 7 Days", 14, 15);

      (doc as any).autoTable({
        startY: 20,
        head: [['Date', 'Day', 'Medicine Adherence (%)', 'Water Intake (ml)', 'Water Intake (glasses)']],
        body: data.map(row => [
          row.date,
          row.day,
          row.adherence,
          row.waterIntakeMl,
          row.waterIntakeGlasses
        ])
      });

      doc.save('health_report.pdf');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {t('history_title')}
          </h1>
          <p className="text-muted-foreground">{t('history_description')}</p>
        </div>
        <Button onClick={handleExport} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {t('export_report_button')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            {t('adherence_chart_title')}
          </CardTitle>
          <CardDescription>{t('adherence_chart_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AdherenceChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            {t('water_chart_title')}
          </CardTitle>
          <CardDescription>{t('water_chart_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <WaterChart />
        </CardContent>
      </Card>
    </div>
  );
}
