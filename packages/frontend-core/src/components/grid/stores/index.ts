import { Writable } from "svelte/store"
import type { APIClient } from "../../../api/types"

import * as Bounds from "./bounds"
import * as Columns from "./columns"
import * as Menu from "./menu"
import * as Pagination from "./pagination"
import * as Reorder from "./reorder"
import * as Resize from "./resize"
import * as Rows from "./rows"
import * as Scroll from "./scroll"
import * as UI from "./ui"
import * as Users from "./users"
import * as Validation from "./validation"
import * as Viewport from "./viewport"
import * as Clipboard from "./clipboard"
import * as Config from "./config"
import * as Sort from "./sort"
import * as Filter from "./filter"
import * as Notifications from "./notifications"
import * as Datasource from "./datasource"
import * as Table from "./datasources/table"
import * as ViewV2 from "./datasources/viewV2"
import * as NonPlus from "./datasources/nonPlus"
import * as Cache from "./cache"
import * as Conditions from "./conditions"

const DependencyOrderedStores = [
  Sort,
  Filter,
  Bounds,
  Table,
  ViewV2,
  NonPlus,
  Datasource,
  Columns,
  Scroll,
  Validation,
  Rows,
  Conditions,
  UI,
  Resize,
  Viewport,
  Reorder,
  Users,
  Menu,
  Pagination,
  Config as any,
  Clipboard,
  Notifications,
  Cache,
]

export interface BaseStore {
  API: APIClient
}

export type Store = BaseStore &
  Columns.Store &
  Table.Store &
  ViewV2.Store &
  NonPlus.Store &
  Datasource.Store & {
    // TODO while typing the rest of stores
    fetch: Writable<any>
    filter: Writable<any>
    inlineFilters: Writable<any>
    allFilters: Writable<any>
    sort: Writable<any>
    initialFilter: Writable<any>
    initialSortColumn: Writable<any>
    initialSortOrder: Writable<any>
    rows: Writable<any> & { actions: any }
    subscribe: any
    config: Writable<any>
    dispatch: (event: string, data: any) => any
    notifications: Writable<any>
    schemaOverrides: Writable<any>
  }

export const attachStores = (context: Store): Store => {
  // Atomic store creation
  for (let store of DependencyOrderedStores) {
    if ("createStores" in store) {
      context = { ...context, ...store.createStores?.(context) }
    }
  }

  // Derived store creation
  for (let store of DependencyOrderedStores) {
    if ("deriveStores" in store) {
      context = { ...context, ...store.deriveStores?.(context) }
    }
  }

  // Action creation
  for (let store of DependencyOrderedStores) {
    if ("createActions" in store) {
      context = { ...context, ...store.createActions?.(context) }
    }
  }

  // Initialise any store logic
  for (let store of DependencyOrderedStores) {
    if ("initialise" in store) {
      store.initialise?.(context)
    }
  }

  return context as Store
}
