

export const getMaxColumns = (spreadSheetMetaData) => {
   return spreadSheetMetaData.properties.gridProperties.columnCount
}


export const getHeaders = (response) => {
    return response.data.valueRanges[0].values[0]
    
 }

 export const getBatchRanges = (response) => {
   return response.data.valueRanges[0].values
   
}

 export const getMaxRows = (spreadSheetMetaData) => {
   return spreadSheetMetaData.properties.gridProperties.rowCount
   
}