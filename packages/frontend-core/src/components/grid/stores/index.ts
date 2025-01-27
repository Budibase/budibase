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
import { SortOrder, UIDatasource, UISearchFilter } from "@budibase/types"
import * as Constants from "../lib/constants"

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

export interface BaseStoreProps {
  datasource: UIDatasource
  initialSortColumn: string | null
  initialSortOrder: SortOrder | null
  initialFilter: UISearchFilter | null
  fixedRowHeight: number | null
  schemaOverrides: Record<
    string,
    {
      displayName?: string
      disabled?: boolean
    }
  > | null
  notifySuccess: (message: string) => void
  notifyError: (message: string) => void
  canAddRows?: boolean
  canEditRows?: boolean
  canDeleteRows?: boolean
  canEditColumns?: boolean
  canExpandRows?: boolean
  canSaveSchema?: boolean
  minHeight?: number
}

export interface BaseStore {
  API: APIClient
  gridID: string
  props: Writable<BaseStoreProps>
  subscribe: any
  dispatch: (event: string, data: any) => any
  Constants: typeof Constants
}

export type Store = BaseStore &
  Columns.Store &
  Table.Store &
  ViewV2.Store &
  NonPlus.Store &
  Datasource.Store &
  Validation.Store &
  Users.Store &
  Menu.Store &
  Filter.Store &
  UI.Store &
  Clipboard.Store &
  Scroll.Store &
  Rows.Store &
  Reorder.Store &
  Resize.Store &
  Config.Store &
  Conditions.Store &
  Cache.Store &
  Viewport.Store &
  Notifications.Store &
  Sort.Store &
  Bounds.Store

export const attachStores = (context: BaseStore): Store => {
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
