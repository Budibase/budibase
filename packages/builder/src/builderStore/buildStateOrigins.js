/**
 * buildStateOrigins
 *
 * Builds an object that details all the bound state in the application, and what updates it.
 *
 * @param screenDefinition - the screen definition metadata.
 * @returns {Object} an object with the client state values and how they are managed.
 */
export const buildStateOrigins = screenDefinition => {
  const origins = {}

  function traverse(propValue) {
    for (let key in propValue) {
      if (!Array.isArray(propValue[key])) continue

      if (key === "_children") propValue[key].forEach(traverse)

      for (let element of propValue[key]) {
        if (element["##eventHandlerType"] === "Set State") origins[element.parameters.path] = element
      }
    }
  }

  traverse(screenDefinition.props)

  return origins
}
