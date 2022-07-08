export const buildMotivo = (motivo) => {
    if (motivo) {
        return <div>
            {motivo.split("-").map(motivoToken => {
                return <div>{motivoToken}</div>
            })}
        </div>
    } else {
        return <ul></ul>
    }


}

export  const getValorSugestao = (volume, unidade, proportionMp, mpId) => {
    let proportion = proportionMp.find(prop => prop.split(":")[0] == mpId)
    if (volume) {
        if (unidade == "%") {
            return +(volume * 0.01 * Number(proportion.split(":")[1])).toFixed(2)
        } else if (unidade == "g/l") {
            return +(volume / 1000 * Number(proportion.split(":")[1])).toFixed(2)
        } else if (unidade == 'mg/l' || unidade == "ml/l") {
            return +(volume / 10000 * Number(proportion.split(":")[1])).toFixed(2)
        }
    } else {
        return 0
    }


}

