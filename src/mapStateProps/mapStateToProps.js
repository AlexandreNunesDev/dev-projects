const mapToStateProps = {
    toProps :  state => {
        return {
          processos : state.options.processos,
          etapas : state.options.etapas,
          parametros : state.options.parametros,
          materiasPrima : state.options.materiasPrima,
          trocas : state.options.trocas,
          tarefasDeManutencao : state.options.tarefasDeManutencao,
          ocp : state.ocp,
          global : state.global,
          notifications : state.notification.notifications,
          timeForm : state.timeReducer,
          analiseForm : state.analiseReducer
        }
    },


    
      
}

export default mapToStateProps 