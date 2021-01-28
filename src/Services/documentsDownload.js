import FileSaver from "file-saver"
import ScqApi from "../Http/ScqApi"

export const downloadOcp = (ocpId) => {
    
   return ScqApi.DownloadOcp(ocpId).then(response => {let file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }); FileSaver.saveAs(file, getFileName(response)) } )
}

export const downloadOmp = (omp) => {
    
   return ScqApi.DownloadOmp(omp).then(response => {let file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }); FileSaver.saveAs(file, getFileName(response)) } )
}

const getFileName = (response) => {
    let dirtyFileName = response.request.getResponseHeader('Content-Disposition').split(";")
     dirtyFileName = dirtyFileName[1]
     return dirtyFileName.slice(10)
}