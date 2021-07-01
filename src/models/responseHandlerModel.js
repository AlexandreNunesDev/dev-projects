export const responseHandlerModel =  function(response, props, type,toastType, context, dispatchersFunctions){
    this.response = response
    this.props = props
    this.type = type
    this.toastType = toastType
    this.context = context
    this.dispatchersFunctions = dispatchersFunctions
}