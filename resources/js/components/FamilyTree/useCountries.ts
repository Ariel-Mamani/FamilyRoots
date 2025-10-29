import { useEffect, useState } from "react";

export interface Country {
    iso: string;
    name: string;
}

export function useCountries() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch("/countries");
                if (!response.ok) throw new Error("Error al obtener países");
                const data = await response.json();
                setCountries(data);
            } catch (err: unknown) {
                console.error("Error al cargar los países:", err);
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return { countries, loading, error };
}
