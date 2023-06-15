import { useEffect, useState } from "react"
import StatusParametro from "../Components/StatusParametro"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import StatusTroca from "../Components/StatusTrocas"

const StatusSCQ = () => {

    const [parametroStatus,setParametroStatus] = useState(null)
    const [trocasStatus,setTrocasStatus] = useState(null)

    useEffect(() => {
        ScqApi.parametroStatus().then(res => setParametroStatus(res))
        ScqApi.trocaStatus().then(res => setTrocasStatus(res))
    },[])




    return <>
    {parametroStatus && <StatusParametro parametroStatusDto={parametroStatus} ></StatusParametro>}
    {trocasStatus && <StatusTroca trocaStatusDto={trocasStatus} ></StatusTroca>}
    </>

}

export default withMenuBar(StatusSCQ)