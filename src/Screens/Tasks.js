import { Table } from "react-bootstrap"
import { connect } from "react-redux"
import { withMenuBar } from "../Hocs/withMenuBar"
import dispatchers from "../mapDispatch/mapDispathToProps"
import mapToStateProps from "../mapStateProps/mapStateToProps"
import 'bootstrap/dist/css/bootstrap.min.css';
import { TableBody } from "@material-ui/core"

const Tasks = () => {
    
    return  (
        <table>
            <thead>
                <th>
                    Número
                </th> 
                <th>
                    Descrição
                </th>
                <th>
                    Prazo
                </th>
            </thead>
            <tbody>
                <td>

                </td>
                <td>
                    
                </td>
                <td>
                    
                </td>

            </tbody>
        
        </table>
    )
}

export default withMenuBar(connect(mapToStateProps.toProps,dispatchers)(Tasks))