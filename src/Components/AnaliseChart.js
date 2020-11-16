import React, { useEffect, useState } from 'react'

import { LineChart, XAxis, CartesianGrid, Line, YAxis,ReferenceLine ,Tooltip} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
    const analise = payload[0]?.payload
    if (active) {
      return (
        <div style={{backgroundColor : "white" ,opacity : 0.65 }} className="custom-tooltip">
          <p className="label">{`Analista: ${analise.Analista}`}</p>
          <p className="intro">{`Data: ${analise.Data}`}</p>
          <p className="intro">{`Resultado: ${analise.Resultado} ${payload[0].unit}`}</p>
        </div>
      );
    }
  
    return null;
  };

const AnaliseChart = (props) => {

    const [entries, setEntries] = useState()
    

    useEffect(() => {
      const resultados = []
      let i = 0;
      for (const resultado of Object.entries(props.data.resultados)) {
          let dataTime = resultado[0].split("T")
          
          let data = {"Analista" : props.data.analistas[i],"Data" : `${dataTime[0]} - ${dataTime[1]}`, "Resultado" : resultado[1]}
          resultados.push(data)
          i = i + 1;
      }
      console.log(props.data)
      console.log(resultados)
  
    
    setEntries(resultados)
    },[props.data])


    return (
        <>
        <h4 style={{alignContent:"center"}}>{`Grafico de Analise  ${props.data.nomeParam} ${props.data.nomeEtapa} ${props.data.nomeProcesso} `}</h4>
      
        <LineChart width={props.containerRef.current.offsetWidth} height={250} 
            data={entries}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <ReferenceLine y={props.data.pMax} stroke="red"  />
            <ReferenceLine y={props.data.pMaxT} stroke="yellow"  />
            <ReferenceLine y={props.data.pMinT} stroke="yellow"  />
            <ReferenceLine y={props.data.pMin} stroke="red"   />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis height={50} tickMargin={20} dataKey="Data" interval="preserveStartEnd" />
            <YAxis  unit={props.data.unidade}/>
            <Tooltip content={<CustomTooltip></CustomTooltip>} />
            <Line type="monotone" unit={props.data.unidade} dataKey="Resultado" strokeWidth={1.5} stroke="cyan" />
        </LineChart>
      
   
        </>
    )
}
export default AnaliseChart