import { isString, isUndefined } from "lodash/fp"
import { types } from "./types"
import { assign } from "lodash"
import { uuid } from "../src/builderStore/uuid"

export const getBuiltin = name => {
  const { props } = createProps({ name })

  return {
    name,
    props,
  }
}

export const getNewScreen = (components, rootComponentName, name) => {
  const rootComponent = components.find(c => c.name === rootComponentName)
  return {
    name: name || "",
    description: "",
    url: "",
    _css: "",
    uiFunctions: "",
    props: createProps(rootComponent).props,
  }
}

/**
 * @param {object} componentDefinition - component definition from a component library
 * @param {object} derivedFromProps - extra props derived from a components given props.
 * @return {object} the fully created properties for the component, and any property parsing errors
 */
export const createProps = (componentDefinition, derivedFromProps) => {
  const errorOccurred = (propName, error) => errors.push({ propName, error })

  const props = {
    _component: componentDefinition.name,
    _styles: { position: {}, layout: {} },
    _id: uuid(),
    _code: "",
  }

  const errors = []

  if (!componentDefinition.name)
    errorOccurred("_component", "Component name not supplied")

  const propsDef = componentDefinition.props
  for (let propDef in propsDef) {
    const parsedPropDef = parsePropDef(propsDef[propDef])
    if (parsedPropDef.error) errorOccurred(propDef, parsedPropDef.error)
    else props[propDef] = parsedPropDef
  }

  if (derivedFromProps) {
    assign(props, derivedFromProps)
  }

  if (componentDefinition.children !== false && isUndefined(props._children)) {
    props._children = []
  }

  return {
    props,
    errors,
  }
}

export const makePropsSafe = (componentDefinition, props) => {
  const safeProps = createProps(componentDefinition, props).props
  for (let propName in safeProps) {
    props[propName] = safeProps[propName]
  }

  for (let propName in props) {
    if (safeProps[propName] === undefined) {
      delete props[propName]
    }
  }

  if (!props._styles) {
    props._styles = { layout: {}, position: {} }
  }

  return props
}

const parsePropDef = propDef => {
  const error = message => ({ error: message, propDef })

  if (isString(propDef)) {
    if (!types[propDef]) return error(`Do not recognise type ${propDef}`)

    return types[propDef].default()
  }

  if (!propDef.type) return error("Property Definition must declare a type")

  const type = types[propDef.type]
  if (!type) return error(`Do not recognise type ${propDef.type}`)

  if (isUndefined(propDef.default)) return type.default(propDef)

  if (!type.isOfType(propDef.default))
    return error(`${propDef.default} is not of type ${type}`)

  return propDef.default
}

export const arrayElementComponentName = (parentComponentName, arrayPropName) =>
  `${parentComponentName}:${arrayPropName}`

/*
Allowed propDefOptions
- type: string, bool, number, array
- default: default value, when undefined
- required: field is required
*/
