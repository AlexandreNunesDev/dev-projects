
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Tooltip, XAxis, YAxis } from "recharts";
import CustomChartTooltip from "./CustomChartTooltip";

//import CustomChartTooltip from "./CustoChartTooltip";

function AdicaoChart({ chartData, containerRef }) {

    const [entries, setEntries] = useState()
    const [displayDetails,setDispalyDetails] = useState([])
   
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
        <BarChart width={containerRef.current.offsetWidth} onClick={(clickObj) => setDispalyDetails([...clickObj.activePayload[0].payload.adicaoDetails,...clickObj.activePayload[1].payload.adicaoDetails])} height={500}
            data={entries}
            margin={{ top: 20, right: 30, left: 50, bottom: 0 }}>
            <Legend content={renderLegend} wrapperStyle={{ position: "relative", left: "45%" }} />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis height={50} tickMargin={20} dataKey="processoNome"  />
            <YAxis />
            <Tooltip content={(props) => CustomChartTooltip(props, ["adicaoDetails"],true)} />

            <Bar fill="#2691fc" stackId={"1"}  dataKey="totalGastosOcp" >
            </Bar>

            <Bar fill="#8cf55f" stackId={"1"} dataKey="totalGastosOmp" >
            </Bar>
        </BarChart>
        <div style={{marginTop : 24}}>
            <table>
                <thead>
                    <th>Etapa</th>
                    <th>Materia Prima</th>
                    <th>Quantidade</th>
                    <th>Gasto Total</th>
                    <th>Tipo</th>
                </thead>
                <tbody>
                    {displayDetails.map((dtails,index) => {
                        
                        return <tr key={index}>
                            <td>{dtails.etapaNome}</td>
                            <td>{dtails.nomeMateriaPrima}</td>
                            <td>{dtails.quantidade}</td>
                            <td>{dtails.gastoTotal}</td>
                            <td>{dtails.isOcp ? "Correção" : "Troca"}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>


    </>
}

export default AdicaoChart;