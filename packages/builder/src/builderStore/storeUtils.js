import {
  makePropsSafe,
  getBuiltin,
} from "components/userInterface/pagesParsing/createProps"
import api from "./api"
import { store } from "builderStore"
import { generate_screen_css } from "./generate_css"
import { uuid } from "./uuid"
import getNewComponentName from "./getNewComponentName"

export const selectComponent = (state, component) => {
  const componentDef = component._component.startsWith("##")
    ? component
    : state.components[component._component]
  state.currentComponentInfo = makePropsSafe(componentDef, component)
  state.currentView = "component"
  return state
}

export const getParent = (rootProps, child) => {
  let parent
  walkProps(rootProps, (p, breakWalk) => {
    if (
      p._children &&
      (p._children.includes(child) || p._children.some(c => c._id === child))
    ) {
      parent = p
      breakWalk()
    }
  })
  return parent
}

export const saveCurrentPreviewItem = s =>
  s.currentFrontEndType === "page"
    ? savePage(s)
    : store.saveScreen(s.currentPreviewItem)

export const savePage = async state => {
  const pageName = state.currentPageName || "main"
  const page = state.pages[pageName]

  const response = await api
    .post(`/api/pages/${page._id}`, {
      page: { componentLibraries: state.pages.componentLibraries, ...page },
      screens: page._screens,
    })
    .then(response => response.json())
  store.update(innerState => {
    innerState.pages[pageName]._rev = response.rev
    return innerState
  })
  return state
}

// export const saveScreenApi = async (screen, state) => {
//   const currentPage = state.pages[state.currentPageName]
//   const response = await api.post(`/api/screens/${currentPage._id}`, screen)
//   const json = await response.json()

//   store.update(innerState => {
//     // TODO: need to update pages in here
//     // innerState.pages[pageName]._rev = response.rev
//     return innerState
//   })

//   await savePage(state)
// }

export const walkProps = (props, action, cancelToken = null) => {
  cancelToken = cancelToken || { cancelled: false }
  action(props, () => {
    cancelToken.cancelled = true
  })

  if (props._children) {
    for (let child of props._children) {
      if (cancelToken.cancelled) return
      walkProps(child, action, cancelToken)
    }
  }
}

export const regenerateCssForScreen = screen => {
  screen._css = generate_screen_css([screen.props])
}

export const regenerateCssForCurrentScreen = state => {
  if (state.currentPreviewItem) {
    regenerateCssForScreen(state.currentPreviewItem)
  }
  return state
}

export const generateNewIdsForComponent = (c, state, changeName = true) =>
  walkProps(c, p => {
    p._id = uuid()
    if (changeName) p._instanceName = getNewComponentName(p._component, state)
  })

export const getComponentDefinition = (state, name) =>
  name.startsWith("##") ? getBuiltin(name) : state.components[name]

export const findChildComponentType = (node, typeToFind) => {
  // Stop recursion if invalid props
  if (!node || !typeToFind) {
    return null
  }

  // Stop recursion if this element matches
  if (node._component === typeToFind) {
    return node
  }

  // Otherwise check if any children match
  // Stop recursion if no valid children to process
  const children = node._children || (node.props && node.props._children)
  if (!children || !children.length) {
    return null
  }

  // Recurse and check each child component
  for (let child of children) {
    const childResult = findChildComponentType(child, typeToFind)
    if (childResult) {
      return childResult
    }
  }

  // If we reach here then no children were valid
  return null
}
