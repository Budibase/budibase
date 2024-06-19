import { debounce } from "../../../utils/utils"

export const initialise = context => {
  const { visiblePages, rows } = context

  const loadVisiblePages = async pages => {
    for (let page of pages) {
      await rows.actions.loadPage(page)
    }
  }
  const throttledLoadVisiblePages = debounce(loadVisiblePages, 250)

  visiblePages.subscribe(throttledLoadVisiblePages)
}
