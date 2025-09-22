'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import type { Medicine } from '@/lib/types';
import { addDays, format, isToday } from 'date-fns';

// Define types for state
interface WaterReminderState {
  isEnabled: boolean;
  interval: string; // in hours
  intake: number;
  goal: number;
  history: Record<string, number>; // { 'YYYY-MM-DD': 2500 }
}

interface ReminderContextType {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  addMedicine: (medicine: Omit<Medicine, 'id' | 'startDate' | 'taken'>) => void;
  removeMedicine: (id: string) => void;
  handleTakenChange: (
    medId: string,
    date: string,
    timeIndex: number,
    isChecked: boolean
  ) => void;
  medicineRemindersEnabled: boolean;
  setMedicineRemindersEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  waterReminder: WaterReminderState;
  setWaterReminder: React.Dispatch<React.SetStateAction<WaterReminderState>>;
}

// Default state
const defaultWaterReminderState: WaterReminderState = {
  isEnabled: false,
  interval: '2',
  intake: 0,
  goal: 2000,
  history: {},
};

const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    dosage: '500mg',
    times: ['09:00', '21:00'],
    duration: 7,
    startDate: new Date(),
    taken: {
      [format(new Date(), 'yyyy-MM-dd')]: [false, false],
    },
  },
  {
    id: '2',
    name: 'Vitamin C',
    dosage: '1000mg',
    times: ['12:00'],
    duration: 30,
    startDate: addDays(new Date(), -5),
    taken: {
      [format(new Date(), 'yyyy-MM-dd')]: [true],
    },
  },
];

const ReminderContext = createContext<ReminderContextType | undefined>(
  undefined
);

// Custom hook for localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item, (k, v) => {
        // More robust date parsing
        if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(v)) {
           if (k.endsWith("Date") || k === "startDate") return new Date(v);
        }
        return v;
      });

      // Special handling for waterReminder state to ensure intake is reset daily
      if (key === 'waterReminder') {
         const lastUpdatedStr = window.localStorage.getItem('waterReminderLastUpdated');
         if (lastUpdatedStr) {
           const lastUpdated = new Date(lastUpdatedStr);
           if (!isToday(lastUpdated)) {
             parsed.intake = 0; // Reset daily intake
           }
         }
      }

      return parsed;

    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        if (key === 'waterReminder') {
           window.localStorage.setItem('waterReminderLastUpdated', new Date().toISOString());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}


export function ReminderProvider({ children }: { children: ReactNode }) {
  const [medicines, setMedicines] = useLocalStorage<Medicine[]>('medicines', mockMedicines);
  const [medicineRemindersEnabled, setMedicineRemindersEnabled] = useLocalStorage<boolean>('medicineRemindersEnabled', false);
  const [waterReminder, setWaterReminder] = useLocalStorage<WaterReminderState>('waterReminder', defaultWaterReminderState);


  const addMedicine = (
    medicine: Omit<Medicine, 'id' | 'startDate' | 'taken'>
  ) => {
    const newMedicine: Medicine = {
      ...medicine,
      id: String(Date.now()),
      startDate: new Date(),
      taken: {},
    };
    setMedicines((prev) => [...prev, newMedicine]);
  };

  const removeMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
  };

  const handleTakenChange = (
    medId: string,
    date: string,
    timeIndex: number,
    isChecked: boolean
  ) => {
    setMedicines((prevMeds) =>
      prevMeds.map((med) => {
        if (med.id === medId) {
          const newTaken = { ...med.taken };
          if (!newTaken[date]) {
            newTaken[date] = Array(med.times.length).fill(false);
          }
          newTaken[date][timeIndex] = isChecked;
          return { ...med, taken: newTaken };
        }
        return med;
      })
    );
  };

  // Effect to update water history when intake changes
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setWaterReminder(prev => {
        // Only update if the value has changed
        if (prev.history[today] !== prev.intake) {
            return {
                ...prev,
                history: {
                    ...prev.history,
                    [today]: prev.intake,
                },
            };
        }
        return prev;
    });
  }, [waterReminder.intake, setWaterReminder]);

  const value = {
    medicines,
    setMedicines,
    addMedicine,
    removeMedicine,
    handleTakenChange,
    medicineRemindersEnabled,
    setMedicineRemindersEnabled,
    waterReminder,
    setWaterReminder,
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
}

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};
