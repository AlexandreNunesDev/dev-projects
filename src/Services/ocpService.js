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