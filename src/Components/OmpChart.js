
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Tooltip, XAxis, YAxis } from "recharts";
import CustomChartTooltip from "./CustomChartTooltip";

//import CustomChartTooltip from "./CustoChartTooltip";

function OmpChart({ chartData, containerRef }) {

    const [entries, setEntries] = useState()


    const generateRate = (ompChartDto, type) => {
        if (type === "troca") {
            let trocaRate = ompChartDto.numberOfTrocasExecuted / ompChartDto.numberOfTrocasShouldBeExecuted
            trocaRate = trocaRate * 100
            trocaRate = trocaRate.toFixed(2)
            if (Number.isNaN(+trocaRate)) {
                return "0.00"
            } else {
                return trocaRate
            }

        } else {
            let tarefaRate = ompChartDto.numberOfTarefasExecuted / ompChartDto.numberOfTarefasShouldBeExecuted
            tarefaRate = tarefaRate * 100
            tarefaRate = tarefaRate.toFixed(2)
            if (Number.isNaN(+tarefaRate)) {
                return "0.00"
            } else {
                return tarefaRate
            }

        }

    }


    const renderLegend = (props) => {
        let customLegend = [{ value: "% Tarefas", color: "#2691fc" }, { value: "% Trocas", color: "#8cf55f" }]

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
        for (const ompChartDto of chartData) {
            let data = {
                "processName": ompChartDto.processName,
                "numberOfTrocasExecuted": ompChartDto.numberOfTrocasExecuted,
                "numberOfTrocasShouldBeExecuted": ompChartDto.numberOfTrocasShouldBeExecuted,
                "numberOfTarefasExecuted": ompChartDto.numberOfTarefasExecuted,
                "numberOfTarefasShouldBeExecuted": ompChartDto.numberOfTarefasShouldBeExecuted,
                "trocaRate": generateRate(ompChartDto, "troca"),
                "tarefaRate": generateRate(ompChartDto, "tarefa")
            }
            resultados.push(data)
        }
        setEntries(resultados)
    }, [chartData])

    return <>
        <h4>Indicador de Omp</h4>
        <BarChart width={containerRef.current.offsetWidth} height={300}
            data={entries}
            margin={{ top: 20, right: 30, left: 50, bottom: 0 }}>
            <Legend content={renderLegend} wrapperStyle={{ position: "relative", left: "45%" }} />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis height={50} tickMargin={20} dataKey="processName" interval="preserveStartEnd" />
            <YAxis unit={"%"} type={"number"} tickCount={10} />
            <Tooltip content={(props) => CustomChartTooltip(props, ["trocaRate", "tarefaRate"])} />

            <Bar fill="#2691fc" stackId={"tarefa"} dataKey="tarefaRate" >
                <LabelList dataKey="tarefaRate" position="top" angle={-90} />
            </Bar>

            <Bar fill="#8cf55f" stackId={"troca"} dataKey="trocaRate" >
                <LabelList dataKey="trocaRate" position="top" angle={-90} />
            </Bar>
        </BarChart>


    </>
}

export default OmpChart;