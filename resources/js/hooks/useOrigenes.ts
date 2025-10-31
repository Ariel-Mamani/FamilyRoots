import { useState, useEffect } from "react";

interface CountryProb {
    jurisdicción: string;
    por_ciento: number;
}

interface SphereProb {
    esfera: string;
    por_ciento: number;
}

// NUEVA interfaz para lo que realmente devuelve la API
interface ApiCountry {
    jurisdiction: string;
    percent: string; // Viene como string, no number
}

interface OnoGraphResponse {
    países: CountryProb[];
    nombre?: string;
    apellido?: string;
    // Agregar la estructura real que devuelve la API
    countries?: ApiCountry[];
}

export function useOrigenes(
    firstName: string,
    lastName: string,
    secondLastName?: string
) {
    const [data, setData] = useState<OnoGraphResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!firstName || !lastName) {
            setData(null);
            return;
        }

        const fetchOrigen = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    fn: firstName,
                    sn: lastName,
                });
                if (secondLastName) params.append("ssn", secondLastName);

                const resp = await fetch(`/api/origenes?${params.toString()}`, {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (!resp.ok) {
                    const text = await resp.text();
                    throw new Error(`Error al consultar el proxy: ${text}`);
                }

                const json = await resp.json();

                // ✅ TRANSFORMAR los datos aquí
                const transformedData: OnoGraphResponse = {
                    países: json.countries ? json.countries.map((c: ApiCountry) => ({
                        jurisdicción: c.jurisdiction,
                        por_ciento: parseFloat(c.percent)
                    })) : [],
                    nombre: firstName,
                    apellido: lastName,
                    ...json
                };

                setData(transformedData);
            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchOrigen();
    }, [firstName, lastName, secondLastName]);

    return { data, loading, error };
}