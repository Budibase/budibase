import { derived, get } from "svelte/store"
import { componentStore } from "@/stores/builder"
import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { Layout } from "@budibase/types"

interface LayoutState {
  layouts: Layout[]
  selectedLayoutId: string | null
}

export const INITIAL_LAYOUT_STATE: LayoutState = {
  layouts: [],
  selectedLayoutId: null,
}

export class LayoutStore extends BudiStore<LayoutState> {
  constructor() {
    super(INITIAL_LAYOUT_STATE)

    this.reset = this.reset.bind(this)
    this.syncAppLayouts = this.syncAppLayouts.bind(this)
    this.select = this.select.bind(this)
    this.deleteLayout = this.deleteLayout.bind(this)
  }

  reset() {
    this.store.set({ ...INITIAL_LAYOUT_STATE })
  }

  syncAppLayouts(pkg: { layouts: Layout[] }) {
    this.update(state => ({
      ...state,
      layouts: [...pkg.layouts],
    }))
  }

  select(layoutId: string) {
    // Check this layout exists
    const state = get(this.store)
    const componentState = get(componentStore)
    const layout = state.layouts.find(layout => layout._id === layoutId)
    if (!layout) {
      return
    }

    // Check layout isn't already selected
    if (
      state.selectedLayoutId === layout._id &&
      componentState.selectedComponentId === layout.props?._id
    ) {
      return
    }

    // Select new layout
    this.update(state => {
      state.selectedLayoutId = layout._id!
      return state
    })

    componentStore.select(layout.props?._id)
  }

  async deleteLayout(layout: Layout) {
    if (!layout?._id || !layout?._rev) {
      return
    }
    await API.deleteLayout(layout._id, layout._rev)
    this.update(state => {
      state.layouts = state.layouts.filter(x => x._id !== layout._id)
      return state
    })
  }
}

export const layoutStore = new LayoutStore()

export const selectedLayout = derived(layoutStore, $store => {
  return $store.layouts?.find(layout => layout._id === $store.selectedLayoutId)
})
