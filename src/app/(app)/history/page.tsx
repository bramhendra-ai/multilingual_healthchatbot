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
import { Download } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function HistoryPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('history_title')}</h1>
          <p className="text-muted-foreground">
            {t('history_description')}
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          {t('export_report_button')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            {t('adherence_chart_title')}
          </CardTitle>
          <CardDescription>
            {t('adherence_chart_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdherenceChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('water_chart_title')}</CardTitle>
          <CardDescription>
            {t('water_chart_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WaterChart />
        </CardContent>
      </Card>
    </div>
  );
}
