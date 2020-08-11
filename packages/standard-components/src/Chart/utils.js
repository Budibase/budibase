import britecharts from "britecharts"

export const notNull = value => value || value === false

export const chartTypes = britecharts ? Object.keys(britecharts) : null

//expose chart color schemas for use or reference outside compnent
export const colorSchemas = britecharts ? britecharts.colors.colorSchemas : null

//export color gradients for use or reference outside the component
export const colorGradients = britecharts
  ? britecharts.colors.colorGradients
  : null

export const getColorSchema = color =>
  color ? colorSchemas[color] : colorSchemas["britecharts"]

export const getChartGradient = gradient =>
  gradient ? colorGradients[gradient] : null
