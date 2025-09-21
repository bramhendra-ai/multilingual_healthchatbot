export type Medicine = {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  duration: number; // in days
  startDate: Date;
  taken: Record<string, boolean[]>; // { 'YYYY-MM-DD': [true, false] }
};
