import { Container } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useHistory, useLocation, useParams } from "react-router-dom"
import DynamicFilterMenu from '../Components/DynamicFilterMenu'
import { withMenuBar } from '../Hocs/withMenuBar'
import {getFieldsFromRoute,getOpsFromRoute} from "../Services/consultaFields"

const Consultas = () => {


    const options = useSelector(state => state.options)
    const location =  useLocation()
    const {consultaPage} = useParams()
    let history = useHistory()
    const onEditClick = (obj) => {
        history.push(`/Editar${consultaPage}`, obj )
    }

    return (
        <Container>
            <h3>Consulta de {consultaPage}</h3>
            <DynamicFilterMenu ops={getOpsFromRoute(consultaPage,location.state?.options || options)} onActionClick={(obj) => onEditClick(obj)} fieldsToInclude={getFieldsFromRoute(consultaPage)}></DynamicFilterMenu>
        </Container>)

}

export default withMenuBar(Consultas)