export const isInsideFaixa = ({resultado,pMin,pMax}) => {
    if((resultado > pMin) && (resultado < pMax)) {
        return true
    }
    return false


}