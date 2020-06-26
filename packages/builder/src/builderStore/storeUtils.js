import { makePropsSafe } from "components/userInterface/pagesParsing/createProps"
import api from "./api"
import { generate_screen_css } from "./generate_css"
import { getFontUrls } from "./getFontUrls"

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
    : saveScreenApi(s.currentPreviewItem, s)

export const savePage = async s => {
  const page = s.pages[s.currentPageName]
  await api.post(`/_builder/api/${s.appId}/pages/${s.currentPageName}`, {
    page: { componentLibraries: s.pages.componentLibraries, ...page },
    uiFunctions: s.currentPageFunctions,
    screens: page._screens,
  })
}

export const saveScreenApi = (screen, s) => {
  api
    .post(`/_builder/api/${s.appId}/pages/${s.currentPageName}/screen`, screen)
    .then(() => savePage(s))
}

export const renameCurrentScreen = (newname, state) => {
  const oldname = state.currentPreviewItem.props._instanceName
  state.currentPreviewItem.props._instanceName = newname

  api.patch(
    `/_builder/api/${state.appId}/pages/${state.currentPageName}/screen`,
    {
      oldname,
      newname,
    }
  )
  return state
}

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

export const regenerateCssForCurrentScreen = state => {
  state.currentPreviewItem._css = generate_screen_css([
    state.currentPreviewItem.props,
  ])
  state.currentPreviewItem._fontUrls = getFontUrls(
    state.currentPreviewItem._css
  )
  return state
}
