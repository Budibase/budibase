/**
 * Capitalises a string.
 *
 * @param string
 * @returns {string}
 */
export const capitalise = string => {
  return string.substring(0, 1).toUpperCase() + string.substring(1)
}

/**
 * Svelte action to set CSS variables on a DOM node.
 *
 * @param node
 * @param props
 */
export const cssVars = (node, props) => {
  Object.entries(props).forEach(([key, value]) => {
    node.style.setProperty(`--${key}`, value)
  })

  return {
    update(new_props) {
      Object.entries(new_props).forEach(([key, value]) => {
        node.style.setProperty(`--${key}`, value)
        delete props[key]
      })

      Object.keys(props).forEach(name => node.style.removeProperty(`--${name}`))
      props = new_props
    },
  }
}
