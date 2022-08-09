import { useEffect, useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { useSelector } from "react-redux"
import { getFormatedField } from "../Services/consultaFields"


const DynamicFilterMenu = ({ ops = [], onActionClick, fieldsToInclude }) => {


    const global = useSelector(state => state.global)
    const isAdmin = global.userRole == "ADMIN_ROLE" ? true : false
    const [innerOps, setInternalOps] = useState(ops)
    const [filteredOps, setFilteredOps] = useState(ops)
    const [filterRules, setFilterRules] = useState({})
    const [headers, setHeaders] = useState()

    /** @param {String} objKey */
    const formatedObjKey = (objKey) => {
        let filterOption = objKey.split(/(?=[A-Z\_])/g).map(word => {
            return word.replace(word[0], word[0].toUpperCase())
        })
        return filterOption
    }

    useEffect(() => {
        let headerss = Object.keys(ops[0]).filter(oKey => {
            if (fieldsToInclude.includes(oKey)) {
                return true
            } else {
                return false
            }
        })
        setInternalOps(ops)
        setHeaders(headerss)



    }, [ops])

    useEffect(() => {
        let inneropscopy = [...innerOps]
        Object.keys(filterRules).forEach(key => {
            inneropscopy = inneropscopy.filter(op => String(op[key]).toLowerCase().startsWith(String(filterRules[key]).toLowerCase()))
        })
        setFilteredOps(inneropscopy)
    }, [filterRules, innerOps])

    const updateFilterRules = (value, header) => {
        let filterRulesCopy = { ...filterRules }
        filterRulesCopy[header] = value
        setFilterRules(filterRulesCopy)
    }



    return <>
        <Container style={{ border: "solid", borderColor: "gray", borderWidth: 2, marginBottom: 10, marginTop: 10 }}>
            <h4>Filtrar por:</h4>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {headers?.map(hd => {
                    return <div key={hd} style={{ padding: 4 }} >
                        <Form.Group>
                            <Form.Label>{hd}</Form.Label>
                            <Form.Control onChange={(event) => updateFilterRules(event.target.value, hd)} ></Form.Control>
                        </Form.Group>
                    </div>
                })}
            </div>
        </Container>
        <div className="table-responsive">
            <div className="tableFixHead">

                {headers && <table >
                    <thead  >
                        <tr >
                            {headers.map((objKey, index) => <th style={{ borderWidth: 0 }} key={index}>{formatedObjKey(objKey)}</th>)}
                            <th style={{ borderWidth: 0 }} >Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOps.map((gerenicObj, index) => {
                            return (<tr key={index}>
                                {headers.map((objKey, ind) => {
                                    let formatedField = getFormatedField(gerenicObj, objKey)
                                    return <td style={{ whiteSpace: "nowrap" }} key={ind} >{formatedField}</td>
                                })}
                                <td key={filteredOps.length + 1}>
                                    <Button disabled={!isAdmin} style={{ margin: 2 }} onClick={() => {
                                        let trueObj = innerOps.find(inOp => inOp.id == gerenicObj.id)
                                        onActionClick(trueObj)
                                    }}>EDITAR</Button>
                                </td>
                            </tr>)
                        })}
                    </tbody>

                </table>}
            </div>
        </div>
    </>

}

export default DynamicFilterMenu