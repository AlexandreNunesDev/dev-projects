
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Tooltip, XAxis, YAxis } from "recharts";
import CustomChartTooltip from "./CustomChartTooltip";

//import CustomChartTooltip from "./CustoChartTooltip";

function AdicaoChart({ chartData, containerRef }) {

    const [entries, setEntries] = useState()
   
    const renderLegend = (props) => {
        let customLegend = [{ value: "R$ total Ocp", color: "#2691fc" }, { value: "R$ total omp", color: "#8cf55f" }]

        return (
            <ul style={{ display: "flex", listStyleType: "none" }}>
                {
                    customLegend.map((entry, index) => (
                        <li style={{ color: entry.color, paddingLeft: 24 }} key={index}>{entry.value}</li>
                    ))
                }
            </ul>
        );
    }


    useEffect(() => {
        const resultados = []
        for (const adicaoChartDto of chartData) {
            let data = {
                "processoNome": adicaoChartDto.processoNome,
                "totalGastosOcp": adicaoChartDto.totalGastosOcp,
                "totalGastosOmp": adicaoChartDto.totalGastosOmp,
                "adicaoDetails": adicaoChartDto.adicaoDetails,
            }
            resultados.push(data)
        }
        setEntries(resultados)
    }, [chartData])

    return <>
        <h4>Indicador de Omp</h4>
        <BarChart width={containerRef.current.offsetWidth} height={500}
            data={entries}
            margin={{ top: 20, right: 30, left: 50, bottom: 0 }}>
            <Legend content={renderLegend} wrapperStyle={{ position: "relative", left: "45%" }} />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis height={50} tickMargin={20} dataKey="processoNome"  />
            <YAxis />
            <Tooltip content={(props) => CustomChartTooltip(props, ["adicaoDetails"],true)} />

            <Bar fill="#2691fc" stackId={"ocp"} dataKey="totalGastosOcp" >
                <LabelList dataKey="totalGastosOcp" position="top" angle={-90} />
            </Bar>

            <Bar fill="#8cf55f" stackId={"omp"} dataKey="totalGastosOmp" >
                <LabelList dataKey="totalGastosOmp" position="top" angle={-90} />
            </Bar>
        </BarChart>


    </>
}

export default AdicaoChart;