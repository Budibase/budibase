import { isPlainObject, isArray, cloneDeep } from "lodash/fp"
import { getExactComponent } from "./searchComponents"

export const rename = (pages, screens, oldname, newname) => {
  pages = cloneDeep(pages)
  screens = cloneDeep(screens)
  const changedScreens = []

  const existingWithNewName = getExactComponent(screens, newname, true)
  if (existingWithNewName)
    return {
      components: screens,
      pages,
      error: "Component by that name already exists",
    }

  const traverseProps = props => {
    let hasEdited = false
    if (props._component && props._component === oldname) {
      props._component = newname
      hasEdited = true
    }

    for (let propName in props) {
      const prop = props[propName]
      if (isPlainObject(prop) && prop._component) {
        hasEdited = traverseProps(prop) || hasEdited
      }
      if (isArray(prop)) {
        for (let element of prop) {
          hasEdited = traverseProps(element) || hasEdited
        }
      }
    }
    return hasEdited
  }

  for (let screen of screens) {
    let hasEdited = false

    // if (screen.name === oldname) {
    //   screen.name = newname
    //   hasEdited = true
    // }

    if (screen.props.instanceName === oldname) {
      screen.props.instanceName = newname
      hasEdited = true
    }

    hasEdited = traverseProps(screen.props) || hasEdited

    if (hasEdited && screen.props.instanceName !== newname) changedScreens.push(screen.props.instanceName)
  }

  for (let pageName in pages) {
    const page = pages[pageName]
    if (page.appBody === oldname) {
      page.appBody = newname
    }
  }

  return { screens, pages, changedScreens }
}
