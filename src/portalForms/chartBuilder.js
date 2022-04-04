
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import GenericSelect from "../Components/GenericSelect";
import { Regra, SerieDeDados } from "./portalModels";



function ChartBuilder({ headers, rows, show, setShow,loadChartSeries }) {


    const [selectedY, setSelectedY] = useState()
    const [selectedX, setSelectedX] = useState()
    const [regras, setRegras] = useState([])
    const [rotulo, setRotulo] = useState()






    function onAddRotuloClick() {
        let index = headers.findIndex(header => selectedX === header)
        setRotulo(new Regra(selectedX, index))
    }


    function onAddSerieClick() {
        let index = headers.findIndex(header => selectedY === header)
        setRegras((prevState) => [...prevState, new Regra(selectedY, index)])
    }

    function computeAndLoad(){
        let chartSeries = regras.map(
              /** @param  {Regra} regra*/
            (regra) => {
            return new SerieDeDados(compute(regra),regra.serieName,"cyan")
        })
        loadChartSeries(chartSeries)
    }

    function compute(regra){
        return rows[regra.colIndex]
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header>
                <Modal.Title>Configure o grafico</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <GenericSelect ops={headers} title={"Escolha uma coluna para o eixo Y"} onChange={(colIndex) => setSelectedY(colIndex)}></GenericSelect>
                    <Button onClick={onAddSerieClick}>Criar serie</Button>
                </div>
                <div>
                    <ol>
                        {regras && regras.map(((regra, index) => <li key={index}><div>{regra.serieName}</div><div></div></li>))}
                    </ol>
                </div>
                <div>
                    <GenericSelect ops={headers} title={"Escolha uma coluna para o eixo X"} onChange={(colIndex) => setSelectedX(colIndex)}></GenericSelect>
                    <Button onClick={onAddRotuloClick}>Escolhe rotulo</Button>
                    <div>
                        <ol>
                            {rotulo && <li key={1}>{rotulo.serieName}</li>}
                        </ol>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={computeAndLoad}>Carregar grafico</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default ChartBuilder