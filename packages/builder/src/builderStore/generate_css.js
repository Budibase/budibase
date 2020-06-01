import {toNumber} from "lodash/fp"

export const generate_screen_css = component_arr => {
  let styles = ""
  for (const { _styles, _id, _children, _component } of component_arr) {
    let [componentName] = _component.match(/[a-z]*$/)
    Object.keys(_styles).forEach(selector => {
      const cssString = generate_css(_styles[selector])
      if (cssString) {
        styles += apply_class(_id, componentName, cssString, selector)
      }
    })
    if (_children && _children.length) {
      styles += generate_screen_css(_children) + "\n"
    }
  }
  return styles.trim()
}

export const generate_css = style => {
  let cssString = Object.entries(style).reduce((str, [key, value]) => {
    //TODO Handle arrays and objects here also
    if (typeof value === "string") {
      if (value) {
        return (str += `${key}: ${value};\n`)
      }
    } else if (Array.isArray(value)) {
      if (value.length > 0 && !value.every(v => v === "")) {
        return (str += `${key}: ${value
          .map(generate_array_styles)
          .join(" ")};\n`)
      }
    }
  }, "")

  return (cssString || "").trim()
}

export const generate_array_styles = item => {
  let safeItem = item === "" ? 0 : item
  let hasPx = new RegExp("px$")
  if (!hasPx.test(safeItem) && !isNaN(toNumber(safeItem))) {
    return `${safeItem}px`
  } else {
    return safeItem
  }
}

export const apply_class = (id, name = "element", styles, selector) => {
  if (selector === "normal") {
    return `.${name}-${id} {\n${styles}\n}`
  } else {
    let sel = selector === "selected" ? "::selection" : `:${selector}`
    return `.${name}-${id}${sel} {\n${styles}\n}`
  }
}
