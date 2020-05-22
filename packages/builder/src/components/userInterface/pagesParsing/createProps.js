import { isString, isUndefined } from "lodash/fp"
import { TYPE_MAP } from "./types"
import { assign } from "lodash"
import { uuid } from "builderStore/uuid"

export const getBuiltin = _component => {
  const { props } = createProps({ _component })

  return {
    _component,
    name: "Screenslot",
    props,
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
    _id: uuid(),
    _component: componentDefinition._component,
    _styles: { normal: {}, hover: {}, active: {}, selected: {} },
    _code: "",
  }

  const errors = []

  if (!componentDefinition._component) {
    errorOccurred("_component", "Component name not supplied")
  }

  for (let propName in componentDefinition.props) {
    const parsedPropDef = parsePropDef(componentDefinition.props[propName])

    if (parsedPropDef.error) {
      errors.push({ propName, error: parsedPropDef.error })
    } else {
      props[propName] = parsedPropDef
    }
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
    props._styles = { normal: {}, hover: {}, active: {}, selected: {} }
  }

  return props
}

const parsePropDef = propDef => {
  const error = message => ({ error: message, propDef })

  if (isString(propDef)) {
    if (!TYPE_MAP[propDef]) return error(`Type ${propDef} is not recognised.`)

    return TYPE_MAP[propDef].default
  }

  const type = TYPE_MAP[propDef.type]
  if (!type) return error(`Type ${propDef.type} is not recognised.`)

  return propDef.default
}

export const arrayElementComponentName = (parentComponentName, arrayPropName) =>
  `${parentComponentName}:${arrayPropName}`
