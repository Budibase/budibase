import { DerivedBudiStore } from "../BudiStore"
import { tables } from "./tables"
import { API } from "@/api"
import { View } from "@budibase/types"
import { helpers } from "@budibase/shared-core"
import { derived, Writable } from "svelte/store"

interface BuilderViewStore {
  selectedViewName: string | null
}

interface DerivedViewStore extends BuilderViewStore {
  list: View[]
  selected?: View
}

export class ViewsStore extends DerivedBudiStore<
  BuilderViewStore,
  DerivedViewStore
> {
  constructor() {
    const makeDerivedStore = (store: Writable<BuilderViewStore>) => {
      return derived([store, tables], ([$store, $tables]): DerivedViewStore => {
        let list: View[] = []
        $tables.list?.forEach(table => {
          const views = Object.values(table?.views || {}).filter(
            (view): view is View => !helpers.views.isV2(view)
          )
          list = list.concat(views)
        })
        return {
          selectedViewName: $store.selectedViewName,
          list,
          selected: list.find(view => view.name === $store.selectedViewName),
        }
      })
    }

    super(
      {
        selectedViewName: null,
      },
      makeDerivedStore
    )

    this.select = this.select.bind(this)
  }

  select = (name: string) => {
    this.store.update(state => ({
      ...state,
      selectedViewName: name,
    }))
  }

  delete = async (view: View) => {
    if (!view.name) {
      throw new Error("View name is required")
    }
    await API.deleteView(view.name)

    // Update tables
    tables.update(state => {
      const table = state.list.find(table => table._id === view.tableId)
      if (table?.views && view.name) {
        delete table.views[view.name]
      }
      return { ...state }
    })
  }

  save = async (view: View & { originalName?: string }) => {
    if (!view.name) {
      throw new Error("View name is required")
    }

    const savedView = await API.saveView(view)
    this.select(view.name)

    // Update tables
    tables.update(state => {
      const table = state.list.find(table => table._id === view.tableId)
      if (table?.views && view.name) {
        if (view.originalName) {
          delete table.views[view.originalName]
        }
        table.views[view.name] = savedView
      }
      return { ...state }
    })
  }
}

export const views = new ViewsStore()
