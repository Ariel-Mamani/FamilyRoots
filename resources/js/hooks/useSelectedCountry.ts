import { useEffect, useState } from 'react';
import { useCountries, Country } from '../components/FamilyTree/useCountries';

export function useSelectedCountry() {
  const { countries, loading, error } = useCountries();
  const [selectedCountry, setSelectedCountryState] = useState<Country | null>(null);

  // Guardar y restaurar país seleccionado usando localStorage
  useEffect(() => {
    // Restaurar país guardado
    if (countries.length > 0) {
      const savedIso = localStorage.getItem('selectedCountryIso');
      const found = countries.find(c => c.iso === savedIso);
      if (found) {
        setSelectedCountryState(found);
      } else if (!selectedCountry) {
        setSelectedCountryState(countries[0]);
      }
    }
    // eslint-disable-next-line
  }, [countries]);

  // Guardar en localStorage cuando cambia
  const setSelectedCountry = (country: Country | null) => {
    setSelectedCountryState(country);
    if (country) {
      localStorage.setItem('selectedCountryIso', country.iso);
    } else {
      localStorage.removeItem('selectedCountryIso');
    }
  };

  return { countries, selectedCountry, setSelectedCountry, loading, error };
}
