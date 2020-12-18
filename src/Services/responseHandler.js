import {capitalize,subId} from '../Services/stringUtils'

export const responseHandler = (response, props) => {
    const { toastManager } = props;
    if(response.error){
        response.data.forEach(erro => {
            toastManager.add(`${subId(capitalize(erro.field))} : ${erro.error}`, {
                appearance: 'error', autoDismiss: true, onDismiss : () => window.location.reload()
              })});
    } else {
        toastManager.add(`Parametro ${response.nome} criado`, {
            appearance: 'success', autoDismiss: true , onDismiss : () => window.location.reload()
          })
    }
}