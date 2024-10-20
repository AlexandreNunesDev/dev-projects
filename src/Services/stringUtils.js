import moment from "moment"

export const capitalize = (s) => {
	if (typeof s !== "string") return ""
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export const subId = (s) => {
	return s.replace("Id", "")
}

export const addApiKey = (url, key) => {
	return `${url}${key}`
}

export const formatIsoDate = (date) => {
	if (date) {
		let day = moment(date).format("YYYY-MM-DDTHH:mm")
		return day
	}
}
export const formatIsoDateAddingSecs = (date) => {
	if (date) {
		let day = moment(date).format("YYYY-MM-DDTHH:mm:ss")
		return day
	}
}

export const FormatDate = (data) => {
	const dataTokens = String(data).split("-")
	return dataTokens[2] + "-" + dataTokens[1] + "-" + dataTokens[0]
}

export const OnlyDate = (data) => {
	const inverseDate = String(data).split("T")
	const onlyDate = inverseDate[0].split("-")
	const time = inverseDate[1]
	return `${onlyDate[2] + "-" + onlyDate[1] + "-" + onlyDate[0]}`
}

export const InverseOnlyDate = (data) => {
	const onlyDate = data.split("-")
	return `${onlyDate[2] + "-" + onlyDate[1] + "-" + onlyDate[0]}`
}

export const DateAndTime = (data) => {
	const inverseDate = String(data).split("T")
	const onlyDate = inverseDate[0].split("-")
	const time = inverseDate[1].split("-")[0]
	return `${onlyDate[2] + "-" + onlyDate[1] + "-" + onlyDate[0]} ${time}`
}
export const onlyTime = (data) => {
	const inverseDate = String(data).split("T")
	const time = inverseDate[1].split(".")
	return time[0]
}

/**@param {string} excelDate */
export const parseExcelDateToDate = (excelDate) => {
	let dateTimeTokens = Array.isArray(excelDate)
		? excelDate[0].split(" ")
		: excelDate.split(" ")
	let data = dateTimeTokens[0]
	let tempo = dateTimeTokens[1]
	let dataTokens = data.split("/")
	let tempoTokens = tempo.split(":")
	let dataTranformada = new Date(
		dataTokens[2],
		dataTokens[1] - 1,
		dataTokens[0],
		tempoTokens[0],
		tempoTokens[1],
		tempoTokens[2]
	)
	return dataTranformada
}
