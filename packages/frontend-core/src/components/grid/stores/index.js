import * as Bounds from "./bounds"
import * as Cache from "./cache"
import * as Clipboard from "./clipboard"
import * as Columns from "./columns"
import * as Config from "./config"
import * as Datasource from "./datasource"
import * as NonPlus from "./datasources/nonPlus"
import * as Table from "./datasources/table"
import * as ViewV2 from "./datasources/viewV2"
import * as Filter from "./filter"
import * as Menu from "./menu"
import * as Notifications from "./notifications"
import * as Pagination from "./pagination"
import * as Reorder from "./reorder"
import * as Resize from "./resize"
import * as Rows from "./rows"
import * as Scroll from "./scroll"
import * as Sort from "./sort"
import * as UI from "./ui"
import * as Users from "./users"
import * as Validation from "./validation"
import * as Viewport from "./viewport"

const DependencyOrderedStores = [
  Sort,
  Filter,
  Bounds,
  Scroll,
  Table,
  ViewV2,
  NonPlus,
  Datasource,
  Columns,
  Rows,
  UI,
  Validation,
  Resize,
  Viewport,
  Reorder,
  Users,
  Menu,
  Pagination,
  Clipboard,
  Config,
  Notifications,
  Cache,
]

export const attachStores = context => {
  // Atomic store creation
  for (let store of DependencyOrderedStores) {
    context = { ...context, ...store.createStores?.(context) }
  }

  // Derived store creation
  for (let store of DependencyOrderedStores) {
    context = { ...context, ...store.deriveStores?.(context) }
  }

  // Action creation
  for (let store of DependencyOrderedStores) {
    context = { ...context, ...store.createActions?.(context) }
  }

  // Initialise any store logic
  for (let store of DependencyOrderedStores) {
    store.initialise?.(context)
  }

  return context
}
