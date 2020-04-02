import { splitName } from "./splitRootComponentName"
import { find, filter, cloneDeep, isPlainObject, isArray } from "lodash/fp"
import { isRootComponent } from "./searchComponents"

export const libraryDependencies = (components, lib) => {
  const componentDependsOnLibrary = comp => {
    if (isRootComponent(comp)) {
      const { libName } = splitName(comp.name)
      return libName === lib
    }
    return componentDependsOnLibrary(
      find(c => c.name === comp.props._component)(components)
    )
  }

  return filter(c => !isRootComponent(c) && componentDependsOnLibrary(c))(
    components
  )
}

export const componentDependencies = (
  pages,
  screens,
  components,
  dependsOn
) => {
  const allComponents = [...cloneDeep(components), ...cloneDeep(screens)]

  pages = cloneDeep(pages)
  const dependantComponents = []
  const dependantPages = []

  const traverseProps = props => {
    if (props._component && props._component === dependsOn.name) {
      return true
    }

    for (let propName in props) {
      const prop = props[propName]
      if (isPlainObject(prop) && prop._component) {
        if (traverseProps(prop)) return true
      }
      if (isArray(prop)) {
        for (let element of prop) {
          if (traverseProps(element)) return true
        }
      }
    }

    return false
  }

  for (let component of allComponents) {
    if (isRootComponent(component)) {
      continue
    }

    if (component.name === dependsOn.name) {
      continue
    }

    if (component.props._component === dependsOn.name) {
      dependantComponents.push(component)
      continue
    }

    if (traverseProps(component.props)) {
      dependantComponents.push(component)
    }
  }

  for (let pageName in pages) {
    const page = pages[pageName]
    if (page.appBody === dependsOn.name) {
      dependantPages.push(pageName)
    }
  }

  return { dependantComponents, dependantPages }
}
