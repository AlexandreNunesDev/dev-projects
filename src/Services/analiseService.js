export const isInsideFaixa = ({ resultado, pMin, pMax }) => {
    if ((+resultado > +pMin) && (+resultado < +pMax)) {
        return true
    }
    return false
}

export const valorNominal = ({ resultado, pMin, pMax }) => {
    return (pMin + pMax)/2
}

export const backGroundByAnaliseStatus = (status) => {
    if (status == 0) {
        return "GREEN"
    } else if (status == 1) {
        return "#f5b642"
    } else {
        return "RED"
    }
}