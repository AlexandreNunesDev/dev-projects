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

export const FormatDate = (data) => {
  const dataTokens = String(data).split("-");
  return dataTokens[2] + "-" + dataTokens[1] + "-" + dataTokens[0]

}

export const OnlyDate = (data) => {
  const inverseDate = String(data).split("T")
  const onlyDate = inverseDate[0].split("-")
  return `${onlyDate[2] + "-" + onlyDate[1] + "-" + onlyDate[0]}`

}
