import { useUbicacion } from "@/hooks/useUbicacion";
import { Tailspin } from 'ldrs/react'
import 'ldrs/react/Tailspin.css'
import CountryFlag from 'react-country-flag';

interface UbicacionInfoProps {
    nombre: string;
    tipo: 'forename' | 'surname';
    titulo?: string;
}

export default function UbicacionInfo({ nombre, tipo, titulo }: UbicacionInfoProps) {
    const { data, loading, error } = useUbicacion(nombre, tipo);

    if (loading) return  <div className="flex justify-center items-center py-8">
        <Tailspin size="40" stroke="5" speed="0.9" color="white" /></div>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!data) return null;

    const displayTitle = titulo || `Distribución geográfica del ${tipo === 'forename' ? 'nombre' : 'apellido'} ${nombre}`;

    return (
        <div className="mt-6 p-4 border rounded-lg bg-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{displayTitle}</h3>

            {/* Estadísticas globales */}
            {data.world && (
                <div className="mb-4 p-3 bg-linear-to-r bg-radial from-amber-200 from-40% to-amber-400 rounded">
                    <h4 className="font-medium text-blue-800">Estadísticas Globales:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-black">
                        <div>
                            <span className="font-medium">Personas en el mundo:</span>
                            <br />
                            <span className="text-blue-600">{parseInt(data.world.incidence).toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="font-medium">Porcentaje mundial:</span>
                            <br />
                            <span className="text-blue-600">{parseFloat(data.world.percent).toFixed(6)}%</span>
                        </div>
                        <div>
                            <span className="font-medium">Ratio:</span>
                            <br />
                            <span className="text-blue-600">1 de cada {parseInt(data.world.ratio).toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="font-medium">Ranking mundial:</span>
                            <br />
                            <span className="text-blue-600">#{parseInt(data.world.rank).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de jurisdicciones */}
            {data.jurisdictions && data.jurisdictions.length > 0 && (
                <div>
                    <h4 className="font-medium mb-3">Distribución por países/regiones:</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full ">
                            <thead className="bg-gray-900 text-lm">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium">País/Región</th>
                                    <th className="px-3 py-2 text-right font-medium"></th>
                                    <th className="px-3 py-2 text-right font-medium">Personas</th>
                                    <th className="px-3 py-2 text-right font-medium">Porcentaje</th>
                                    <th className="px-3 py-2 text-right font-medium">Relación</th>
                                    <th className="px-3 py-2 text-right font-medium">Clasificación (popularidad en el país)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {data.jurisdictions.slice(0, 10).map((juris, index) => (
                                    <tr key={juris.iso} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'} >
                                        <td className="px-3 py-2 font-medium">
                                            {juris.jurisdiction}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <CountryFlag countryCode={juris.iso} svg style={{width: '40px', height: '40px',}} title={juris.jurisdiction}/>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            {parseInt(juris.incidence).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2 text-right text-blue-100">
                                            {parseFloat(juris.percent).toFixed(6)}%
                                        </td>
                                        <td className="px-3 py-2 text-right text-white">
                                            1:{parseInt(juris.ratio).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs text-black">
                                                #{parseInt(juris.rank).toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {data.jurisdictions.length > 10 && (
                        <p className="text-sm text-gray-200 mt-2">
                            Mostrando 10 de {data.jurisdictions.length} jurisdicciones
                        </p>
                    )}
                </div>
            )}

            {(!data.jurisdictions || data.jurisdictions.length === 0) && (
                <p className="text-gray-500">No se encontraron datos de distribución para este {tipo === 'forename' ? 'nombre' : 'apellido'}.</p>
            )}
        </div>
    );
}