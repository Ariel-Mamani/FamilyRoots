// Hook para obtener holidays de Nager.Date API
import { useEffect, useState } from 'react';

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties?: string[];
  launchYear?: number;
  type: string;
}

export function useHolidays(countryCode: string, year: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryCode || !year) return;
    setLoading(true);
    setError(null);
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron obtener los holidays');
        return res.json();
      })
      .then(setHolidays)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [countryCode, year]);

  return { holidays, loading, error };
}
