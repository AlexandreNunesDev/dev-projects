import React from "react";

export const CustomDot = (props) => {

        const {payload} = props
        const { cx, cy } = props;
        let hasOcp = false
       
        if(payload.observacoesOcp !== null && payload.observacoesOcp.trim() !== "" ){
            hasOcp = true
        }

        return (
            <circle cx={cx} cy={cy} r={5} stroke="cyan" strokeWidth={3} fill={hasOcp ? "cyan" : "white"} />
        );
    
};