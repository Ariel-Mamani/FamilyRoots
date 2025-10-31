import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useUserNodes } from "@/hooks/useUserNodes";
import { useOrigenes } from "@/hooks/useOrigenes";
import { origenes } from "@/routes"
import UbicacionInfo from "@/components/UbicacionInfo";
import { Tailspin } from 'ldrs/react'
import 'ldrs/react/Tailspin.css'


export default function OrigenesPage() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const { data, loading: loadingOrigen, error: errorOrigen } = useOrigenes(nombre, apellido);
    const { nodes, loading, error } = useUserNodes();
    const [selected, setSelected] = useState("");
    const [mostrarUbicacion, setMostrarUbicacion] = useState(false);
    const [tipoBusqueda, setTipoBusqueda] = useState<'forename' | 'surname'>('forename');

    // Separar nombre y apellido automaticamente
    const handleSelectChange = (value: string) => {
        setSelected(value);
        const partes = value.split(" ");
        setNombre(partes[0]);
        setApellido(partes.slice(1).join(" "));

        setMostrarUbicacion(true);
        setTipoBusqueda('forename');
    };
    const breadcrumbs: BreadcrumbItem[] = [{
        title: 'Origenes',
        href: origenes().url,
    },];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <h2 className="text-lg font-bold mb-2">Buscar Origen de un Familiar</h2>

                {loading && <p>Cargando nodos...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && nodes.length > 0 && (
                    <select
                        className="border rounded p-2 w-full mb-4 text-white"
                        value={selected}
                        onChange={(e) => handleSelectChange(e.target.value)}
                    >
                        <option value="" className="text-black">Seleccione un familiar</option>
                        {nodes.map((n) => (
                            <option key={n.id} value={n.name} className="text-black">
                                {n.name}
                            </option>
                        ))}
                    </select>
                )}
                {!loading && nodes.length === 0 && (
                    <p className="text-gray-500 mt-4">Primero debes crear un arbol e ingresar familiares en el mismo</p>
                )}

                {/* MOSTRAR RESULTADOS ACA  */}
                {loadingOrigen &&
                    <div className="flex justify-center items-center py-8">
                        <Tailspin size="40" stroke="5" speed="0.9" color="white" />
                    </div>}
                {errorOrigen && <p className="text-red-500">{errorOrigen}</p>}

                {data && data.países && data.países.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">
                            Origen probable de {apellido || data.apellido}
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium">País/Región</th>
                                        <th className="px-3 py-2 text-left font-medium">Probabilidad</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {data.países.slice(0, 6).map((p: { jurisdicción: string; por_ciento: number }) => (
                                        <tr key={p.jurisdicción}>
                                            <td className="px-3 py-2 font-medium">{p.jurisdicción}</td>
                                            <td className="px-3 py-2 font-medium">{p.por_ciento.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {data && (!data.países || data.países.length === 0) && (
                    <p className="text-gray-500 mt-4">No se encontraron resultados para este apellido.</p>
                )}

                
                {mostrarUbicacion && nombre && (
                    <UbicacionInfo
                        nombre={tipoBusqueda === 'forename' ? nombre : apellido}
                        tipo={tipoBusqueda}
                        titulo={`Distribución geográfica del ${tipoBusqueda === 'forename' ? 'nombre' : 'apellido'} ${tipoBusqueda === 'forename' ? nombre : apellido}`}
                    />
                )}
            </div>
        </AppLayout>
    );
}
