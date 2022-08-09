import { useCallback, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useHistory, useLocation, useParams } from "react-router-dom"
import DynamicFilterMenu from '../Components/DynamicFilterMenu'
import { withMenuBar } from '../Hocs/withMenuBar'
import { getFieldsFromRoute, getOpsFromRoute } from "../Services/consultaFields"

const Consultas = () => {

    const options = useSelector(state => state.options)
    const location = useLocation()
    const { consultaPage } = useParams()
    let history = useHistory()
    const [ops, setOps] = useState()

    const onEditClick = (obj) => {
        history.push(`/Editar${consultaPage}`, obj)
    }

    useEffect(() => {
        getOpsFromRoute(consultaPage, location.state?.options || options).then(res => setOps(res) )
    },[consultaPage])


/*     if(!ops) {
        getOpsFromRoute(consultaPage, location.state?.options || options).then(res => setOps(res) )
  
    } */



    return (<Container>
        <h3>Consulta de {consultaPage}</h3>
        {ops && <DynamicFilterMenu ops={ops || []} onActionClick={(obj) => onEditClick(obj)} fieldsToInclude={getFieldsFromRoute(consultaPage)}></DynamicFilterMenu>}
    </Container>)

}

export default withMenuBar(Consultas)