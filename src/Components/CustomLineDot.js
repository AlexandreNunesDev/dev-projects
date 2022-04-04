import React from "react";
import { isMobile } from "react-device-detect";

export const CustomDot = (props) => {

        const {payload} = props
        const { cx, cy } = props;
        let hasOcp = false
       
       
        if((props.ocps[payload.id] != undefined) && (props.ocps[payload.id].length > 0 )){
            hasOcp = true
        }

        return (
            <circle cx={cx} cy={cy} r={isMobile ? 3 : 5} stroke="cyan" strokeWidth={3} fill={hasOcp ? "cyan" : "white"} />
        );
    
};