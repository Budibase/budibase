export const formatters = {
  ["Default"]: val => val,
  ["Thousands"]: val => `${Math.round(val / 1000)}K`,
  ["Millions"]: val => `${Math.round(val / 1000000)}M`,
  ["Datetime"]: val => new Date(val).toLocaleString(),
}

export const parsePalette = paletteName => {
  if (paletteName === "Custom") {
    // return null in this case so that the palette option doesn't get consumed by Apex Charts
    return null
  }

  const [_, number] = paletteName.split(" ")

  return `palette${number}`
}

// Deep clone which copies function references
export const cloneDeep = value => {
  const typesToNaiveCopy = ["string", "boolean", "number", "function", "symbol"]

  if (value === null) {
    return null
  }

  if (value === undefined) {
    return undefined
  }

  if (typesToNaiveCopy.includes(typeof value)) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(element => cloneDeep(element))
  }

  // Only copy "pure" objects, we want to error on stuff like Maps or Sets
  if (typeof value === "object" && value.constructor.name === "Object") {
    const cloneObject = {}

    Object.entries(value).forEach(([key, childValue]) => {
      cloneObject[key] = cloneDeep(childValue)
    })

    return cloneObject
  }

  throw `Unsupported value: "${value}" of type: "${typeof value}"`
}
