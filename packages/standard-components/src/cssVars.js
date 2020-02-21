// https://github.com/kaisermann/svelte-css-vars

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

export const createClasses = classes => {
  let all = ""
  for (let cls in classes) {
    if (classes[cls]) {
      all = all + " " + cls
    }
  }
  return all
}

export default cssVars
