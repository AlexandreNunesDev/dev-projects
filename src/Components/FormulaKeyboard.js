import React from 'react'
import { Button, Container, Row } from 'react-bootstrap'

import GenericDropDown from './GenericDropDown'



const FormulaKeyboard = function (props) {
   
   

    return (
        <Container>
            <h4>Operadores Matematicos</h4>
            <Row>
                <Button key={'plus'} style={{margin : 2}} onClick={() => {props.onPlusClick()}}>*</Button>
                <Button key={'radix'} style={{margin : 2}} onClick={() => {props.onPowClick()}}>^</Button>
                <Button key={'divide'} style={{margin : 2}} onClick={() => {props.onDivideClick()}} >/</Button>
                <Button key={'add'} style={{margin : 2}} onClick={() => {props.onAddClick()}}>+</Button>
                <Button key={'minus'} style={{margin : 2}} onClick={() => {props.onMinusClick()}}>-</Button>
                <Button key={'viragem'} style={{margin : 2}} onClick={() => {props.onViragemClick()}} >Viragem</Button>
                <Button key={'del'} style={{margin : 2}} onClick={() => {props.onDeleteClick()}}>DEL</Button>
            </Row>
            <h4>Referencias para Formula</h4>
            <Row> 
                <GenericDropDown defaultDisplay={"Processo"} returnType={"id"} showType={"nome"} key={'ddLinha'} itens={props.processos || []} onChoose={props.onProcessoChoosen}></GenericDropDown>              
                <GenericDropDown defaultDisplay={"Etapa"} returnType={"id"} showType={"nome"} key={'ddEtapa'} itens={props.etapas || []} onChoose={props.onEtapaChoosen}></GenericDropDown>
                <GenericDropDown defaultDisplay={"Parametro"} returnType={"id"} showType={"nome"} key={'ddParametro'} itens={props.parametros || []} onChoose={props.onParametroChoosen} ></GenericDropDown>
                <GenericDropDown defaultDisplay={"Matera Prima"} returnType={"fatorTitulometrico"} showType={"nome"}  key={'ddMp'} itens={props.meteriasPrima || []} onChoose={props.onMateriaPrimaChoosen} ></GenericDropDown>
            </Row>
            
            
        </Container>
    )

}
export default FormulaKeyboard