import { get, derived } from "svelte/store"
import BudiStore from "stores/BudiStore"
import { tables } from "./tables"
import { viewsV2 } from "./viewsV2"
import { automationStore } from "./automations"
import { API } from "api"
import { getSequentialName } from "helpers/duplicate"

const initialState = {}

export class RowActionStore extends BudiStore {
  constructor() {
    super(initialState)
  }

  reset = () => {
    this.store.set(initialState)
  }

  refreshRowActions = async sourceId => {
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
    const actions = Object.values(res || {})
    this.update(state => ({
      ...state,
      [tableId]: actions,
    }))
  }

  createRowAction = async (tableId, viewId, name) => {
    if (!tableId) {
      return
    }

    // Get a unique name for this action
    if (!name) {
      const existingRowActions = get(this.store)[tableId] || []
      name = getSequentialName(existingRowActions, "New row action ", {
        getName: x => x.name,
      })
    }

    // Create the action
    const res = await API.rowActions.create({
      name,
      tableId,
    })

    // Enable action on this view if adding via a view
    if (viewId) {
      await Promise.all([
        this.enableView(tableId, viewId, res.id),
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

  enableView = async (tableId, viewId, rowActionId) => {
    await API.rowActions.enableView({
      tableId,
      viewId,
      rowActionId,
    })
    await this.refreshRowActions(tableId)
  }

  disableView = async (tableId, viewId, rowActionId) => {
    await API.rowActions.disableView({
      tableId,
      viewId,
      rowActionId,
    })
    await this.refreshRowActions(tableId)
  }

  rename = async (tableId, rowActionId, name) => {
    await API.rowActions.update({
      tableId,
      rowActionId,
      name,
    })
    await this.refreshRowActions(tableId)
    automationStore.actions.fetch()
  }

  delete = async (tableId, rowActionId) => {
    await API.rowActions.delete({
      tableId,
      rowActionId,
    })
    await this.refreshRowActions(tableId)
    // We don't need to refresh automations as we can only delete row actions
    // from the automations store, so we already handle the state update there
  }

  trigger = async (sourceId, rowActionId, rowId) => {
    await API.rowActions.trigger({
      sourceId,
      rowActionId,
      rowId,
    })
  }
}

const store = new RowActionStore()
const derivedStore = derived(store, $store => {
  let map = {}

  // Generate an entry for every view as well
  Object.keys($store || {}).forEach(tableId => {
    // We need to have all the actions for the table in order to be displayed in the crud section
    map[tableId] = $store[tableId]
    for (let action of $store[tableId]) {
      const otherSources = (action.allowedSources || []).filter(
        sourceId => sourceId !== tableId
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
