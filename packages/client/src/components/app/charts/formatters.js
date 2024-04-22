const formatters = {
  ["Default"]: val => val,
  ["Thousands"]: val => `${Math.round(val / 1000)}K`,
  ["Millions"]: val => `${Math.round(val / 1000000)}M`,
  ["Datetime"]: val => new Date(val).toLocaleString(),
}

export default formatters
