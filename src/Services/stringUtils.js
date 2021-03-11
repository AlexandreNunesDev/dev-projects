import moment from "moment";

export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  };

export const subId = (s) => {
    
    return s.replace("Id", "");
  };


  
export const formatIsoDate = (date) => {
    
  return moment(date).format("yyyy-MM-DDTHH:mm:ss");
};
