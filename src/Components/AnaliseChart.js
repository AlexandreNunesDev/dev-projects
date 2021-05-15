import moment from 'moment';
import React, { useEffect, useState } from 'react'

import { LineChart, XAxis, CartesianGrid, Line, YAxis,ReferenceLine ,Tooltip} from 'recharts'
import AnaliseEdit from './AnaliseEdit';

const CustomTooltip = ({ active, payload }) => {
    
    const analise = payload == null ? null : payload[0]?.payload
   

    if (active && payload!= null) {
      return (
        <div  style={{backgroundColor : "white" ,opacity : 0.65 }} className="custom-tooltip">
          <p className="label">{`Id: ${analise.id}`}</p>
          <p className="label">{`Analista: ${analise.Analista}`}</p>
          <p className="intro">{`Data: ${analise.Data}`}</p>
          <p className="intro">{`Resultado: ${analise.Resultado} ${payload[0].unit}`}</p>
          <p className="intro">{`Observacao: ${analise.observacoes}`}</p>
        </div>
      );
    }
  
    return null;
  };

const AnaliseChart = (props) => {

    const [entries, setEntries] = useState()
    const [selectedAnalise, setSelectedAnalise] = useState()
    const [show,setShow] = useState(false)

    const handleClose = () => {
      setShow(false)
    }

    useEffect(() => {
      const resultados = []
      let i = 0;
      for (const resultado of Object.entries(props.data.resultados)) {
          let dataTime = resultado[0].split("T")
          let dataFormatada = moment(dataTime[0]).format("DD-MM-yy")
          
          let data = {"id" : props.data.analisesId[i], "Analista" : props.data.analistas[i],"Data" : `${dataFormatada} - ${dataTime[1]}`, "Resultado" : resultado[1].toFixed(2), "unidade" : props.data.unidade,
           "defaultData" : resultado[0], "processoId": props.data.processoId, "etapaId": props.data.etapaId,
           "parametroId": props.data.parametroId, "observacoes" : props.data.observacoes[i] }
          resultados.push(data)
          i = i + 1;
      }
 
  
    
    setEntries(resultados)},[props.data])

      const handleClick = (event,payload) => {
      
      setSelectedAnalise(payload.payload)
      setShow(true)
    }




    const buildDomain = () => {
        let yMax = props.data.pMax
        let yMin = props.data.pMin
        return [yMin,yMax] 
    }

  

    return (
        <>
        <h4 style={{alignContent:"center"}}>{`Grafico de Analise  ${props.data.nomeParam} ${props.data.nomeEtapa} ${props.data.nomeProcesso} `}</h4>
      
        <AnaliseEdit show={show} handleClose={handleClose} analise={selectedAnalise}></AnaliseEdit>
        <LineChart  width={props.containerRef.current.offsetWidth} height={250}  

            data={entries}
            margin={{ top: 20, right: 30, left: 30, bottom: 0 }}>
            <ReferenceLine y={props.data.pMax} label={props.data.pMax}  stroke="red" strokeWidth={2} />
            <ReferenceLine y={props.data.pMaxT} label={props.data.pMaxT}  stroke="yellow"  strokeWidth={2} />
            <ReferenceLine y={props.data.pMinT} label={props.data.pMinT} stroke="yellow" strokeWidth={2}  />
            <ReferenceLine y={props.data.pMin} label={props.data.pMin} stroke="red"  strokeWidth={2} />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis height={50} tickMargin={20} dataKey="Data" interval="preserveStartEnd" />
            <YAxis  unit={props.data.unidade} type={"number"} domain={buildDomain()} tickCount={10}/>
            <Tooltip content={<CustomTooltip ></CustomTooltip>} />
            <Line  type="monotone"  unit={props.data.unidade} dataKey="Resultado" activeDot={{ onClick: handleClick }}  strokeWidth={1.5} stroke="cyan" />
        </LineChart>
      
   
        </>
    )
}
export default AnaliseChart