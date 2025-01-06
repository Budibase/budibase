import { derived, get, Writable } from "svelte/store"
import { tables } from "./tables"
import { API } from "@/api"
import { DerivedBudiStore } from "@/stores/BudiStore"
import { CreateViewRequest, UpdateViewRequest, ViewV2 } from "@budibase/types"
import { helpers } from "@budibase/shared-core"

interface BuilderViewV2Store {
  selectedViewId: string | null
}

interface DerivedViewV2Store extends BuilderViewV2Store {
  list: ViewV2[]
  selected?: ViewV2
}

export class ViewV2Store extends DerivedBudiStore<
  BuilderViewV2Store,
  DerivedViewV2Store
> {
  constructor() {
    const makeDerivedStore = (store: Writable<BuilderViewV2Store>) => {
      return derived(
        [store, tables],
        ([$store, $tables]): DerivedViewV2Store => {
          let list: ViewV2[] = []
          $tables.list?.forEach(table => {
            const views = Object.values(table?.views || {}).filter(
              helpers.views.isV2
            )
            list = list.concat(views)
          })
          return {
            ...$store,
            list,
            selected: list.find(view => view.id === $store.selectedViewId),
          }
        }
      )
    }

    super(
      {
        selectedViewId: null,
      },
      makeDerivedStore
    )

    this.select = this.select.bind(this)
  }

  select(id: string) {
    this.store.update(state => ({
      ...state,
      selectedViewId: id,
    }))
  }

  async delete(view: { id: string }) {
    await API.viewV2.delete(view.id)
    this.replaceView(view.id, null)
  }

  async create(view: CreateViewRequest) {
    const savedViewResponse = await API.viewV2.create(view)
    const savedView = savedViewResponse.data
    this.replaceView(savedView.id, savedView)
    return savedView
  }

  async save(view: UpdateViewRequest) {
    const res = await API.viewV2.update(view)
    const savedView = res?.data
    this.replaceView(view.id, savedView)
  }

  // Handles external updates of tables
  replaceView(viewId: string, view: ViewV2 | null) {
    const existingView = get(this.derivedStore).list.find(
      view => view.id === viewId
    )
    const tableIndex = get(tables).list.findIndex(table => {
      return table._id === view?.tableId || table._id === existingView?.tableId
    })
    if (tableIndex === -1) {
      return
    }

    // Handle deletion
    if (!view && existingView) {
      tables.update(state => {
        delete state.list[tableIndex].views![existingView.name]
        return state
      })
      return
    }

    // Add new view
    else if (!existingView && view) {
      tables.update(state => {
        state.list[tableIndex].views ??= {}
        state.list[tableIndex].views[view.name] = view
        return state
      })
    }

    // Update existing view
    else if (existingView && view) {
      tables.update(state => {
        // Remove old view
        state.list[tableIndex].views ??= {}
        delete state.list[tableIndex].views[existingView.name]

        // Add new view
        state.list[tableIndex].views[view.name] = view
        return state
      })
    }
  }
}

export const viewsV2 = new ViewV2Store()
