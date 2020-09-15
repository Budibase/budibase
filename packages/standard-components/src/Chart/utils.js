import britecharts from "britecharts"

export const notNull = value => value || value === false

export const hasProp = (data, prop) => data.every(d => prop in d)

export const chartTypes = britecharts ? Object.keys(britecharts) : null

//expose chart color schemas for use or reference outside compnent
export const colorSchemas = britecharts ? britecharts.colors.colorSchemas : null

//export color gradients for use or reference outside the component
export const colorGradients = britecharts ? britecharts.colors.colorGradients : null

export const getColorSchema = color => (color ? colorSchemas[color] : colorSchemas["britecharts"])

export const getChartGradient = gradient => (gradient ? colorGradients[gradient] : null)

export function reformatDataKey(data = [], dataKey = null, formatKey = null) {
  let ignoreList = ["_id", "_rev", "id"]
  if (dataKey && data.every(d => d[dataKey])) {
    return data.map(d => {
      let clonedRecord = { ...d }
      if (clonedRecord[formatKey]) {
        delete clonedRecord[formatKey]
      }
      let value = clonedRecord[dataKey]
      if (!ignoreList.includes(dataKey)) {
        delete clonedRecord[dataKey]
      }
      clonedRecord[formatKey] = value
      return clonedRecord
    })
  } else {
    return data
  }
}
