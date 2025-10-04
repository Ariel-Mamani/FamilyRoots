import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

import { useEffect, useRef } from "react";
import * as go from "gojs";
import familyData from "../data/family.json";
import { Input, message } from "antd";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Search } = Input;
interface Arbol {
    id: number;
    name: string;
}

interface PageProps {
    arbol: Arbol;
    [key: string]: unknown;
}

export default function EspacioTrabajo() {
    const { arbol } = usePage<PageProps>().props;

    const diagramRef = useRef<HTMLDivElement | null>(null);
    const myDiagramRef = useRef<go.Diagram | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Árboles', href: '/espacio-trabajo/' + arbol.id },
    ];

    useEffect(() => {
        if (diagramRef.current) {
            const $ = go.GraphObject.make;

            const myDiagram = $(go.Diagram, diagramRef.current, {
                "undoManager.isEnabled": true,
                layout: $(go.TreeLayout, { angle: 90, layerSpacing: 40 }),
                contentAlignment: go.Spot.Center,
            });

            myDiagramRef.current = myDiagram;

            myDiagram.nodeTemplate = $(
                go.Node,
                "Auto",
                $(
                    go.Shape,
                    "RoundedRectangle",
                    {
                        fill: "#2E8B57",
                        stroke: null,
                        parameter1: 10,
                    }
                ),
                $(
                    go.Panel,
                    "Vertical",
                    { margin: 8, defaultAlignment: go.Spot.Center },

                    $(
                        go.Panel,
                        "Spot",
                        {
                            isClipping: true,
                            width: 120,
                            height: 120,
                        },
                        $(go.Shape, "Circle", {
                            width: 120,
                            height: 120,
                            strokeWidth: 0,
                            fill: "#eee",
                        }),
                        $(
                            go.Picture,
                            {
                                width: 120,
                                height: 120,
                                imageStretch: go.ImageStretch.UniformToFill,
                            },
                            new go.Binding("source")
                        )
                    ),

                    $(
                        go.Panel,
                        "Table",
                        {
                            margin: 8,
                            defaultAlignment: go.Spot.Left,
                        },
                        $(
                            go.TextBlock,
                            { row: 0, font: "bold 14px sans-serif", stroke: "white" },
                            new go.Binding("text", "name")
                        ),
                        $(
                            go.TextBlock,
                            { row: 1, font: "12px sans-serif", stroke: "white" },
                            new go.Binding("text", "fechaNacimiento", (f) => `Nacimiento: ${f}`)
                        ),
                        $(
                            go.TextBlock,
                            { row: 2, font: "12px sans-serif", stroke: "white" },
                            new go.Binding("text", "edad", (e) => `Edad: ${e} años`)
                        ),
                        $(
                            go.TextBlock,
                            { row: 3, font: "12px sans-serif", stroke: "white" },
                            new go.Binding(
                                "text",
                                "lugarNacimiento",
                                (l) => `Lugar: ${l}`
                            )
                        )
                    )
                )
            );

            myDiagram.linkTemplate = $(
                go.Link,
                { routing: go.Routing.Orthogonal, corner: 5 },
                $(go.Shape, { strokeWidth: 2, stroke: "#555" })
            );

            myDiagram.model = new go.TreeModel(familyData);
        }
    }, []);

    const normalizeText = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const handleSearch = (value: string) => {
        const diagram = myDiagramRef.current;
        if (!diagram) return;

        diagram.startTransaction("highlight search");
        diagram.clearSelection();

        const searchTerm = normalizeText(value);
        let foundNode: go.Node | null = null;

        diagram.nodes.each(node => {
            if (normalizeText(node.data.name).includes(searchTerm)) {
                foundNode = node;
            }
        });

        if (foundNode) {
            diagram.select(foundNode);

            const node = foundNode as any;
            if (node.actualBounds) {
                diagram.centerRect(node.actualBounds);
            }

            setTimeout(() => {
                if (node.actualBounds) {
                    diagram.centerRect(node.actualBounds);
                }
            }, 10);

            diagram.scale = 3.0;
        } else {
            message.warning("No se encontró un familiar con ese nombre");
            diagram.scale = 1.2;
        }

        diagram.commitTransaction("highlight search");
    };


    const handleDownloadPDF = () => {
        const diagram = myDiagramRef.current;
        if (!diagram) {
            message.warning("Diagrama no inicializado");
            return;
        }

        const bounds = diagram.documentBounds;

        //aumenta el tamaño para asegurar que capture todo
        const img = diagram.makeImageData({
            background: "white",
            scale: 1,
            size: new go.Size(bounds.width * 1.2, bounds.height * 1.2)
        }) as string;

        if (!img) {
            message.warning("No se pudo generar la imagen del diagrama");
            return;
        }

        // crear PDF
        const pdf = new jsPDF("landscape", "pt", "a4");
        const imgProps = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Arbol_Familiar_${arbol.name || "arbol"}.pdf`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Espacio de trabajo - ${arbol.name}`} />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Espacio de trabajo: Arbol familia {arbol.name}
                </h1>
                <div className="flex justify-between items-center mb-10">
                    <Search
                        placeholder="Buscar familiar..."
                        enterButton="Buscar"
                        onSearch={handleSearch}
                        className='max-w-100'
                    />
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-blue-600 text-white rounded px-4 py-2 cursor-pointer">
                        Descargar PDF
                    </button>
                </div>

                <div>
                    <div
                        ref={diagramRef}
                        className='w-full h-[1000px] rounded-md bg-emerald-100'
                    ></div>
                </div>

            </div>
        </AppLayout>
    );
}
