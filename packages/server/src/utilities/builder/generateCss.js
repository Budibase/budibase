exports.generateAssetCss = component_arr => {
  let styles = ""
  for (const { _styles, _id, _children, _component } of component_arr) {
    let [componentName] = _component.match(/[a-z]*$/)
    Object.keys(_styles).forEach(selector => {
      const cssString = exports.generateCss(_styles[selector])
      if (cssString) {
        styles += exports.applyClass(_id, componentName, cssString, selector)
      }
    })
    if (_children && _children.length) {
      styles += exports.generateAssetCss(_children) + "\n"
    }
  }
  return styles.trim()
}

exports.generateCss = style => {
  let cssString = Object.entries(style).reduce((str, [key, value]) => {
    if (typeof value === "string") {
      if (value) {
        return (str += `${key}: ${value};\n`)
      }
    } else if (Array.isArray(value)) {
      if (value.length > 0 && !value.every(v => v === "")) {
        return (str += `${key}: ${value.join(" ")};\n`)
      }
    }

    return str
  }, "")

  return (cssString || "").trim()
}

exports.applyClass = (id, name = "element", styles, selector) => {
  if (selector === "normal") {
    return `.${name}-${id} {\n${styles}\n}`
  } else {
    let sel = selector === "selected" ? "::selection" : `:${selector}`
    return `.${name}-${id}${sel} {\n${styles}\n}`
  }
}
