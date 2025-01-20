import { get, derived } from "svelte/store"
import { BudiStore } from "@/stores/BudiStore"
import { tables } from "./tables"
import { viewsV2 } from "./viewsV2"
import { automationStore } from "./automations"
import { API } from "@/api"
import { getSequentialName } from "@/helpers/duplicate"

interface RowAction {
  id: string
  name: string
  tableId: string
  allowedSources?: string[]
}

interface RowActionState {
  [tableId: string]: RowAction[]
}

const initialState: RowActionState = {}

export class RowActionStore extends BudiStore<RowActionState> {
  constructor() {
    super(initialState)
  }

  reset = () => {
    this.set(initialState)
  }

  refreshRowActions = async (sourceId: string) => {
    if (!sourceId) {
      return
    }

    // Get the underlying table ID for this source ID
    let tableId = get(tables).list.find(table => table._id === sourceId)?._id
    if (!tableId) {
      const view = get(viewsV2).list.find(view => view.id === sourceId)
      tableId = view?.tableId
    }
    if (!tableId) {
      return
    }

    // Fetch row actions for this table
    const res = await API.rowActions.fetch(tableId)
    const actions = Object.values(res || {}) as RowAction[]
    this.update(state => ({
      ...state,
      [tableId]: actions,
    }))
  }

  createRowAction = async (tableId: string, viewId?: string, name?: string) => {
    if (!tableId) {
      return
    }

    // Get a unique name for this action
    if (!name) {
      const existingRowActions = get(this)[tableId] || []
      name = getSequentialName(existingRowActions, "New row action ", {
        getName: x => x.name,
      })!
    }

    if (!name) {
      throw new Error("Failed to generate a unique name for the row action")
    }

    // Create the action
    const res = await API.rowActions.create(tableId, name)

    // Enable action on this view if adding via a view
    if (viewId) {
      await Promise.all([
        this.enableView(tableId, res.id, viewId),
        automationStore.actions.fetch(),
      ])
    } else {
      await Promise.all([
        this.refreshRowActions(tableId),
        automationStore.actions.fetch(),
      ])
    }

    return res
  }

  enableView = async (tableId: string, rowActionId: string, viewId: string) => {
    await API.rowActions.enableView(tableId, rowActionId, viewId)
    await this.refreshRowActions(tableId)
  }

  disableView = async (
    tableId: string,
    rowActionId: string,
    viewId: string
  ) => {
    await API.rowActions.disableView(tableId, rowActionId, viewId)
    await this.refreshRowActions(tableId)
  }

  delete = async (tableId: string, rowActionId: string) => {
    await API.rowActions.delete(tableId, rowActionId)
    await this.refreshRowActions(tableId)
    // We don't need to refresh automations as we can only delete row actions
    // from the automations store, so we already handle the state update there
  }

  trigger = async (sourceId: string, rowActionId: string, rowId: string) => {
    await API.rowActions.trigger(sourceId, rowActionId, rowId)
  }
}

const store = new RowActionStore()
const derivedStore = derived<RowActionStore, RowActionState>(store, $store => {
  const map: RowActionState = {}

  // Generate an entry for every view as well
  Object.keys($store || {}).forEach(tableId => {
    // We need to have all the actions for the table in order to be displayed in the crud section
    map[tableId] = $store[tableId]
    for (let action of $store[tableId]) {
      const otherSources = (action.allowedSources || []).filter(
        (sourceId: string) => sourceId !== tableId
      )
      for (let source of otherSources) {
        map[source] ??= []
        map[source].push(action)
      }
    }
  })

  return map
})

export const rowActions = {
  ...store,
  subscribe: derivedStore.subscribe,
}
