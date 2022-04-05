import moment from "moment"
import { parseExcelDateToDate } from "../Services/stringUtils"
import { Cell, Row } from "./portalModels"


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

    /** @returns {Array<Row>} row */
export const buildModels = (spreadSheetData,maxCol) => {
   let models =  spreadSheetData.map(
       /** @param {Array} row */
      (row,rowIndex) => {
         let cells = []
      for (let index = 0; index < maxCol; index++) {
         if(row[index]) {
            cells.push(row[index])
         } else {
            cells.push("")
         }
  
      }
      let cellsModel = cells.map((cellValue,index) =>new Cell(index+1,rowIndex+2,cellValue) )
      return new Row(parseExcelDateToDate(row[0]),cellsModel)
   });

   return models
   
   
}

