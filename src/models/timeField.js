export const timefieldFactory =  function(index, label, initialTime, finalTime, parametroId, isMeasuring, isSaved){
    return {index : index , label : label , initialTime : initialTime, finalTime : finalTime,parametroId : parametroId,isMeasuring : isMeasuring,isSaved : isSaved}
}