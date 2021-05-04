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

/**
 * Generates a short random ID.
 * This is "nanoid" but rollup was derping attempting to bundle it, so the
 * source has just been extracted manually since it's tiny.
 */
export const generateID = (size = 21) => {
  let id = ""
  let bytes = crypto.getRandomValues(new Uint8Array(size))

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    let byte = bytes[size] & 63
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36)
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += "_"
    } else {
      id += "-"
    }
  }
  return id
}
