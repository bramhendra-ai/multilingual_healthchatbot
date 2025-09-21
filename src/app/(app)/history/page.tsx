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

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Health Reports</h1>
          <p className="text-muted-foreground">
            Your weekly summary of medicine and water intake.
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Weekly Medicine Adherence
          </CardTitle>
          <CardDescription>
            Percentage of doses taken on schedule over the last 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdherenceChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Weekly Water Intake</CardTitle>
          <CardDescription>
            Number of glasses of water logged over the last 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WaterChart />
        </CardContent>
      </Card>
    </div>
  );
}
