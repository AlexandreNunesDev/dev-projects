export function Cell(colIndex,rowIndex,value) {
    this.col = colIndex
    this.row = rowIndex
    this.value = value
}

/** 
 * @param {Date} date
 * @param {Array<Cell>} cells
 */
export function Row(date,cells) {
    this.date = date
    this.cells = cells
}

export function SerieDeDados(values,legend,color) {
    this.values = values
    this.legend = legend
    this.color = color
    
}


export function Regra(serieName,colIndex) {
    this.serieName = serieName
    this.colIndex = colIndex
}


