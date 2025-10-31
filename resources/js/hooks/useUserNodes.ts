import { useEffect, useState } from "react";
import axios from "axios";

export interface UserNode {
    id: number;
    name: string;
    arbol_id: number;
}

export const useUserNodes = () => {
    const [nodes, setNodes] = useState<UserNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await axios.get("/api/nodos-usuario");
                setNodes(response.data);
            } catch (err) {
                setError("Error al cargar los nodos del usuario");
            } finally {
                setLoading(false);
            }
        };

        fetchNodes();
    }, []);

    return { nodes, loading, error };
};
