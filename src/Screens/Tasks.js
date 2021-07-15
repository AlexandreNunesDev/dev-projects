import { connect } from "react-redux"
import { withMenuBar } from "../Hocs/withMenuBar"
import dispatchers from "../mapDispatch/mapDispathToProps"
import mapToStateProps from "../mapStateProps/mapStateToProps"

const Tasks = () => {
    
}

export default withMenuBar(connect(mapToStateProps.toProps,dispatchers)(Tasks))