
/* 
  TODO: all strings types are really inputs and could be typed as such
  TODO: Options types need option items
  TODO: Allow for default values for all properties
*/

export const layout = {
  flexDirection: { displayName: "Direction", type: "string" },
  justifyContent: { displayName: "Justify", type: "string" },
  alignItems: { displayName: "Align", type: "string" },
  flexWrap: { displayName: "Wrap", type: "options" },
}

export const spacing = {
  padding: { type: "string" },
  margin: { type: "string" },
}

export const size = {
  width: { type: "string" },
  height: { type: "string" },
  minWidth: { displayName: "Min W", type: "string" },
  minHeight: { displayName: "Min H", type: "string" },
  maxWidth: { displayName: "Max W", type: "string" },
  maxHeight: { displayName: "Max H", type: "string" },
  overflow: { type: "string" }, //custom
}

export const position = {
  position: { type: "options" },
}

export const typography = {
  font: { type: "options" },
  weight: { type: "options" },
  size: { type: "string" },
  lineHeight: { displayName: "Line H", type: "string" },
  color: { type: "colour" },
  align: { type: "string" }, //custom
  transform: { type: "string" }, //custom
  style: { type: "string" }, //custom
}

export const background = {
  backgroundColor: { displayName: "Background Color", type: "colour" },
  image: { type: "string" }, //custom
}

export const border = {
  radius: { type: "string" },
  width: { type: "string" }, //custom
  color: { type: "colour" },
  style: { type: "options" },
}

export const effects = {
  opacity: "string",
  rotate: "string",
  shadow: "string",
}

export const transitions = {
  property: { type: "options" },
  duration: { type: "string" },
  ease: { type: "options" },
}

export function excludeProps(props, propsToExclude) {
  const modifiedProps = {}
  for (const prop in props) {
    if (!propsToExclude.includes(prop)) {
      modifiedProps[prop] = props[prop]
    }
  }
  return modifiedProps
}
