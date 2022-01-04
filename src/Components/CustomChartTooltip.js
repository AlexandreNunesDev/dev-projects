import React from 'react'

const CustomChartTooltip = ({ active, payload },propertiesToAvoid,formatNumber) => {

    const cunstonFormater = (number) => {
        let numberToCheck = number
        if(typeof +numberToCheck == "number") {
            return (number).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
        } else {
            return number
        }
       
    }


    let rawData = payload == null ? null : payload[0]?.payload
    let tooltipParagraph = []
    if(rawData) {
        for (var [key] of Object.entries(rawData)) {
            if(!propertiesToAvoid.includes(key)){
                tooltipParagraph.push( <p key={key} className="intro">{`${key.charAt(0).toUpperCase() + key.split(/(?=[A-Z])/).join(" ").slice(1)}: ${formatNumber ? cunstonFormater(rawData[key]) : rawData[key] }`}</p>)
            }
            
        }
    }
   
    

    if (active && payload != null) {
        return (
            <div style={{ backgroundColor: "white", opacity: 0.65 }} className="custom-tooltip">
                {tooltipParagraph}
            </div>
        );
    }

    return null;
};



export default CustomChartTooltip