import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { LineChart, XAxis, CartesianGrid, Line, YAxis, ReferenceLine, Tooltip } from 'recharts'
import dispatchers from '../mapDispatch/mapDispathToProps';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import AnaliseEdit from './AnaliseEdit';
import { CustomDot } from './CustomLineDot';
import OcpView from './OcpView';



const AnaliseChart = (props) => {

  const [entries, setEntries] = useState()
  const [selectedAnalise, setSelectedAnalise] = useState()
  const [ocps, setOcps] = useState()
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  const CustomTooltip = ({ active, payload }) => {

    const analise = payload == null ? null : payload[0]?.payload



    if (active && payload != null) {

      return (
        <div style={{ backgroundColor: "white", opacity: 0.65, }} className="custom-tooltip">
          <p className="label">{`Id: ${analise.id}`}</p>
          <p className="label">{`Analista: ${analise.Analista}`}</p>
          <p className="intro">{`Data: ${analise.Data}`}</p>
          <p className="intro">{`Resultado: ${analise.Resultado} ${payload[0].unit}`}</p>
          <p className="intro">{`Obs analise: ${analise.observacoesAnalise}`}</p>
          <p className="intro">{`Obs ocp: ${analise.observacoesOcp}`}</p>
        </div>
      );
    }




    return null;
  };

  useEffect(() => {
    const resultados = []
    let i = 0;
    for (const resultado of Object.entries(props.data.resultados)) {
      let dataTime = resultado[0].split("T")
      let dataFormatada = moment(dataTime[0]).format("DD-MM-yy")

      let data = {
        "id": props.data.analisesId[i], "Analista": props.data.analistas[i], "Data": `${dataFormatada} - ${dataTime[1]}`, "Resultado": resultado[1].toFixed(2), "unidade": props.data.unidade,
        "defaultData": resultado[0], "processoId": props.data.processoId, "etapaId": props.data.etapaId,
        "parametroId": props.data.parametroId, "observacoesAnalise": props.data.observacoesAnalise[i], "observacoesOcp": props.data.observacoesOcp[i]
      }
      resultados.push(data)
      i = i + 1;
    }



    setEntries(resultados)
  }, [props.data])

  const handleClick = (event, payload) => {
    let ocpsFromAnalise  = props.data.ocps[payload.payload.id]
    setOcps(ocpsFromAnalise)
    props.loadOcpView(ocpsFromAnalise) 
    setSelectedAnalise(payload.payload)

    setShow(true)
  }

  const buildDomain = () => {
    let yMax
    let yMin
    if (props.data.limiteMax) {
      yMax = props.data.limiteMax > props.data.yRangeMax ? props.data.limiteMax : props.data.yRangeMax
    } else {
      yMax = props.data.pMax
    }

    if (props.data.limiteMin) {
      yMin = props.data.limiteMin < props.data.yRangeMin ? props.data.limiteMin : props.data.yRangeMin
    } else {
      yMin = props.data.pMin
    }

    return [yMin, yMax]
  }

  const getCpkBgColor = (cpk) => {
    if(cpk < 1) {
      return "#ed493e"
    }else if(cpk >= 1 && cpk < 1.33) {
        return "#f0e06c"
    } else if(cpk >= 1.33) {
      return "#9cf078"
    } else if(cpk > 1.66) {
      return  "#8ae364"
    } else {
      return "#dce1e3"
    }
  }



  return (
    <Fragment  key={props.chave}>
      <h4 style={{ alignContent: "center" }}>{`Grafico de Analise  ${props.data.nomeParam} ${props.data.nomeEtapa} ${props.data.nomeProcesso} `}</h4>

      <OcpView></OcpView>
      <AnaliseEdit  show={show} handleClose={handleClose} showOcps={() => props.showOcpView(true)} ocps={ocps} analise={selectedAnalise} reloadChart={props.reloadChart}></AnaliseEdit>
      <div style={{ display: "flex-auto" }}>
        <LineChart width={props.containerRef.current.offsetWidth} height={250}

          data={entries}
          margin={{ top: 20, right: 30, left: 30, bottom: 0 }}>
          <ReferenceLine y={props.data.pMax} label={props.data.pMax} stroke="red" strokeWidth={2} />
          <ReferenceLine y={props.data.pMaxT} label={props.data.pMaxT} stroke="yellow" strokeWidth={2} />
          <ReferenceLine y={props.data.pMinT} label={props.data.pMinT} stroke="yellow" strokeWidth={2} />
          <ReferenceLine y={props.data.pMin} label={props.data.pMin} stroke="red" strokeWidth={2} />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis height={50} tickMargin={20} dataKey="Data" interval="preserveStartEnd" />
          <YAxis unit={props.data.unidade} type={"number"} domain={buildDomain()} tickCount={10} />
          <Tooltip position={{ y: -80 }} content={<CustomTooltip  ></CustomTooltip>} />
          <Line type="monotone" unit={props.data.unidade} activeDot={{ onClick: handleClick }} dataKey="Resultado" dot={<CustomDot ocps={props.data.ocps} />} strokeWidth={1.5} stroke="cyan" />
        </LineChart>
        <div >
          <Table hidden={!props.showAnalitics}>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Mínimo</th>
                <th style={{ textAlign: "center" }}>Máximo</th>
                <th style={{ textAlign: "center" }}>Média</th>
                <th style={{ textAlign: "center" }}>cpk</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ backgroundColor: "#dce1e3", textAlign: "center" }}>{`${props.data.statisticas[0]} ${props.data.unidade}`} </td>
                <td style={{ backgroundColor: "#dce1e3", textAlign: "center" }}>{`${props.data.statisticas[1]} ${props.data.unidade}`}</td>
                <td style={{ backgroundColor: "#dce1e3", textAlign: "center" }}>{`${props.data.statisticas[2]} ${props.data.unidade}`}</td>
                <td style={{ backgroundColor:  getCpkBgColor(props.data.statisticas[3]), textAlign: "center" }}>{`${props.data.statisticas[3]}`}</td>
              </tr>
              <tr >
                <th style={{ textAlign: "center" }}>Fora Specificicado</th>
                <th style={{ textAlign: "center" }}>Fora Faixa Trabalho</th>
                <th style={{ textAlign: "center" }}>Dentro Faixa Trabalho</th>
                <th style={{ textAlign: "center" }}>Dentro da Frequencia</th>
              </tr>
              <tr >
                <td style={{ backgroundColor: "#ed493e", textAlign: "center" }} >{props.data.numbersOfRed}</td>
                <td style={{ backgroundColor: "#f0e06c", textAlign: "center" }}>{props.data.numbersOfYellow}</td>
                <td style={{ backgroundColor: "#8ae364", textAlign: "center" }}>{props.data.numbersOfGreen}</td>
                <td style={{ backgroundColor: "#7fb2f0", textAlign: "center" }}>{props.data.numbersOfInsideFrequency}</td>
              </tr>
            </tbody>
          </Table>
        </div>

      </div>


    </Fragment>
  )
}
export default connect(mapToStateProps.toProps, dispatchers)(AnaliseChart)