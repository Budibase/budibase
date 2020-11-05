import {makePropsSafe} from "../../../../components/userInterface/pagesParsing/createProps"
import {generate_screen_css} from "../../../generate_css"
import {get} from "svelte/store"
import api from "../../../api"
import { store } from "builderStore"

class Page {
  constructor(page) {
    this.pageName = page.name
    this.pageObj = page
  }

  select() {
    store.update(state => {
      const pageName = this.pageName
      const current_screens = state.pages[pageName]._screens

      const currentPage = state.pages[pageName]

      state.currentFrontEndType = "page"
      state.currentView = "detail"
      state.currentPageName = pageName
      state.screens = Array.isArray(current_screens)
        ? current_screens
        : Object.values(current_screens)

      // This is the root of many problems.
      // Uncaught (in promise) TypeError: Cannot read property '_component' of undefined
      // it appears that the currentPage sometimes has _props instead of props
      // why
      const safeProps = makePropsSafe(
        state.components[currentPage.props._component],
        currentPage.props
      )
      state.currentComponentInfo = safeProps
      currentPage.props = safeProps
      state.currentPreviewItem = state.pages[pageName]
      store.actions.screens.regenerateCssForCurrentScreen()

      for (let screen of state.screens) {
        screen._css = generate_screen_css([screen.props])
      }

      return state
    })
  }

  async save() {
    const page = this.pageObj
    const storeContents = get(store)
    const pageName = storeContents.currentPageName || "main"
    const pageToSave = page || storeContents.pages[pageName]

    // TODO: revisit. This sends down a very weird payload
    const response = await api
      .post(`/api/pages/${pageToSave._id}`, {
        page: {
          componentLibraries: storeContents.pages.componentLibraries,
          ...pageToSave,
        },
        screens: pageToSave._screens,
      })
      .then(response => response.json())

    store.update(state => {
      state.pages[pageName]._rev = response.rev
      return state
    })
  }
}