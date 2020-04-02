import { pipe } from "../../common/core"

import { find, isUndefined, filter, some, includes } from "lodash/fp"

const normalString = s => (s || "").trim().toLowerCase()

export const isRootComponent = c =>
  isComponent(c) && isUndefined(c.props._component)

export const isComponent = c => {
  const hasProp = n => !isUndefined(c[n])
  return hasProp("name") && hasProp("props")
}

export const searchAllComponents = (components, phrase) => {
  const hasPhrase = (...vals) =>
    pipe(vals, [some(v => includes(normalString(phrase))(normalString(v)))])

  const componentMatches = c => {
    if (hasPhrase(c.name, ...(c.tags || []))) return true

    if (isRootComponent(c)) return false

    const parent = getExactComponent(components, c.props._component)

    return componentMatches(parent)
  }

  return filter(componentMatches)(components)
}

export const getExactComponent = (components, name) => {
  const stringEquals = (s1, s2) => normalString(s1) === normalString(s2)

  return pipe(components, [find(c => stringEquals(c.name, name))])
}

export const getAncestorProps = (components, name, found = []) => {
  const thisComponent = getExactComponent(components, name)

  if (isRootComponent(thisComponent)) return [thisComponent.props, ...found]

  return getAncestorProps(components, thisComponent.props._component, [
    { ...thisComponent.props },
    ...found,
  ])
}
