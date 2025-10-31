import { useState, useEffect } from "react";

interface Jurisdiction {
    incidence: string;
    percent: string;
    ratio: string;
    rank: string;
    jurisdiction: string;
    iso: string;
}
interface ApiStatus {
    code: number;
    message: string;
}
interface UbicacionResponse {
    jurisdictions: Jurisdiction[];
    world?: {
        incidence: string;
        percent: string;
        ratio: string;
        rank: string;
    };
    name: string;
    type: string;
    sanitizedName?: string;
    status?: ApiStatus[];
    remainingCredits?: number;
}

export function useUbicacion(
    name: string,
    type: 'forename' | 'surname'
) {
    const [data, setData] = useState<UbicacionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!name?.trim()) {
            setData(null);
            return;
        }

        const fetchUbicacion = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    name: name.trim(),
                    type: type,
                });

                const resp = await fetch(`/api/ubicacion?${params.toString()}`, {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (!resp.ok) {
                    const text = await resp.text();
                    throw new Error(`Error al consultar ubicación: ${text}`);
                }

                const json = await resp.json();
                setData(json as UbicacionResponse);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchUbicacion();
    }, [name, type]);

    return { data, loading, error };
}